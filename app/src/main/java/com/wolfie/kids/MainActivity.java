package com.wolfie.kids;

import android.app.Activity;
import android.content.Context;
import android.content.Intent;
import android.graphics.Color;
import android.net.Uri;
import android.os.Bundle;
import android.speech.tts.TextToSpeech;
import android.view.View;
import android.webkit.JavascriptInterface;
import android.webkit.WebChromeClient;
import android.webkit.WebResourceRequest;
import android.webkit.WebView;
import android.webkit.WebViewClient;
import android.widget.Toast;
import org.json.JSONObject;
import java.io.ByteArrayOutputStream;
import java.io.InputStream;
import java.io.OutputStream;
import java.nio.charset.StandardCharsets;
import java.util.Locale;

/** Offline first-party Android shell; no network permissions and no external browser content. */
public final class MainActivity extends Activity {
    private static final String HOME = "file:///android_asset/index.html";
    private static final String PREFS = "wolfie_kids";
    private static final String KEY = "kids_progress_v1";
    private static final int LIMIT = 500000;
    private static final int EXPORT_REQUEST = 5201;
    private static final int IMPORT_REQUEST = 5202;
    private WebView webView;
    private TextToSpeech tts;
    private volatile boolean ttsReady = false;

    @Override public void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        getWindow().setStatusBarColor(Color.rgb(255,248,243));
        getWindow().setNavigationBarColor(Color.rgb(255,248,243));
        int flags = View.SYSTEM_UI_FLAG_LIGHT_STATUS_BAR;
        if (android.os.Build.VERSION.SDK_INT >= 26) flags |= View.SYSTEM_UI_FLAG_LIGHT_NAVIGATION_BAR;
        getWindow().getDecorView().setSystemUiVisibility(flags);
        tts = new TextToSpeech(this, status -> {
            if(status == TextToSpeech.SUCCESS && tts != null) {
                int language = tts.setLanguage(Locale.US);
                ttsReady = language >= TextToSpeech.LANG_AVAILABLE;
                tts.setSpeechRate(0.83f);
            }
        });
        webView = new WebView(this);
        webView.setBackgroundColor(Color.rgb(255,248,243));
        // Explicit WebChromeClient is needed for Android WebView confirmation dialogs.
        webView.setWebChromeClient(new WebChromeClient());
        webView.getSettings().setJavaScriptEnabled(true);
        webView.getSettings().setDomStorageEnabled(true);
        webView.getSettings().setAllowFileAccess(true);
        webView.getSettings().setAllowContentAccess(false);
        webView.getSettings().setAllowFileAccessFromFileURLs(false);
        webView.getSettings().setAllowUniversalAccessFromFileURLs(false);
        webView.getSettings().setBlockNetworkLoads(true);
        webView.addJavascriptInterface(new KidsBridge(getApplicationContext()), "KidsAndroid");
        webView.setWebViewClient(new WebViewClient() {
            @Override public boolean shouldOverrideUrlLoading(WebView view, WebResourceRequest request) {
                return !HOME.equals(request.getUrl().toString());
            }
        });
        setContentView(webView);
        webView.loadUrl(HOME);
    }

    private void notice(String message) {
        Toast.makeText(this, message, Toast.LENGTH_LONG).show();
    }

    /** Android document picker: no storage permissions or cloud service required. */
    private void chooseDocument(boolean exporting) {
        try {
            Intent intent = new Intent(exporting ? Intent.ACTION_CREATE_DOCUMENT : Intent.ACTION_OPEN_DOCUMENT);
            intent.addCategory(Intent.CATEGORY_OPENABLE);
            intent.setType("application/json");
            if(exporting) intent.putExtra(Intent.EXTRA_TITLE, "Eva-English-Kids-progress.json");
            startActivityForResult(intent, exporting ? EXPORT_REQUEST : IMPORT_REQUEST);
        } catch(Exception e) {
            notice("Не удалось открыть выбор файла");
        }
    }

    @Override protected void onActivityResult(int requestCode, int resultCode, Intent data) {
        super.onActivityResult(requestCode, resultCode, data);
        if((requestCode != EXPORT_REQUEST && requestCode != IMPORT_REQUEST)
                || resultCode != RESULT_OK || data == null || data.getData() == null) return;
        Uri uri = data.getData();
        try {
            if(requestCode == EXPORT_REQUEST) {
                String progress = getSharedPreferences(PREFS, MODE_PRIVATE).getString(KEY, "{}");
                JSONObject backup = new JSONObject();
                backup.put("format", "eva-english-kids");
                backup.put("version", 1);
                backup.put("progress", new JSONObject(progress));
                byte[] bytes = backup.toString(2).getBytes(StandardCharsets.UTF_8);
                if(bytes.length > LIMIT) throw new IllegalArgumentException("Слишком большой файл");
                try(OutputStream out = getContentResolver().openOutputStream(uri, "w")) {
                    if(out == null) throw new IllegalStateException("Нет доступа к файлу");
                    out.write(bytes);
                    out.flush();
                }
                notice("Прогресс Евы сохранён в выбранный файл");
            } else {
                byte[] bytes;
                try(InputStream in = getContentResolver().openInputStream(uri);
                    ByteArrayOutputStream out = new ByteArrayOutputStream()) {
                    if(in == null) throw new IllegalStateException("Нет доступа к файлу");
                    byte[] buffer = new byte[4096];
                    int count;
                    while((count = in.read(buffer)) != -1) {
                        if(out.size()+count > LIMIT) throw new IllegalArgumentException("Слишком большой файл");
                        out.write(buffer,0,count);
                    }
                    bytes = out.toByteArray();
                }
                JSONObject backup = new JSONObject(new String(bytes, StandardCharsets.UTF_8));
                if(!"eva-english-kids".equals(backup.optString("format")) || backup.optInt("version") != 1)
                    throw new IllegalArgumentException("Неподходящий формат");
                JSONObject progress = backup.optJSONObject("progress");
                if(progress == null || progress.optJSONObject("done") == null
                        || progress.optJSONObject("items") == null || progress.optJSONObject("days") == null)
                    throw new IllegalArgumentException("Некорректные данные");
                if(!getSharedPreferences(PREFS, MODE_PRIVATE).edit().putString(KEY, progress.toString()).commit())
                    throw new IllegalStateException("Не удалось сохранить прогресс");
                notice("Прогресс восстановлен. Приложение обновится.");
                if(webView != null) webView.loadUrl(HOME);
            }
        } catch(Exception e) {
            notice("Ошибка файла: " + e.getMessage());
        }
    }

    private final class KidsBridge {
        private final Context context;
        KidsBridge(Context context) { this.context = context; }

        @JavascriptInterface public String loadProgress() {
            return context.getSharedPreferences(PREFS, Context.MODE_PRIVATE).getString(KEY, "{}");
        }
        /** Commit synchronously from the WebView bridge worker to avoid losing recent answers. */
        @JavascriptInterface public boolean saveProgress(String data) {
            if(data == null || data.length() > LIMIT) return false;
            return context.getSharedPreferences(PREFS, Context.MODE_PRIVATE).edit().putString(KEY, data).commit();
        }
        @JavascriptInterface public void exportProgress() {
            runOnUiThread(() -> chooseDocument(true));
        }
        @JavascriptInterface public void importProgress() {
            runOnUiThread(() -> chooseDocument(false));
        }
        @JavascriptInterface public boolean isSpeechAvailable() { return ttsReady; }
        @JavascriptInterface public void speak(String text) {
            if(text == null || text.length() >= TextToSpeech.getMaxSpeechInputLength() || !ttsReady) return;
            runOnUiThread(() -> {
                if(tts == null || !ttsReady) return;
                tts.setLanguage(Locale.US);
                tts.speak(text, TextToSpeech.QUEUE_FLUSH, null, "eva-english");
            });
        }
        @JavascriptInterface public void speakRussian(String text) {
            if(text == null || text.length() >= TextToSpeech.getMaxSpeechInputLength()) return;
            runOnUiThread(() -> {
                if(tts == null) return;
                int language = tts.setLanguage(new Locale("ru", "RU"));
                if(language >= TextToSpeech.LANG_AVAILABLE)
                    tts.speak(text, TextToSpeech.QUEUE_FLUSH, null, "eva-russian");
                else tts.setLanguage(Locale.US);
            });
        }
        @JavascriptInterface public void setSystemBarColor(String hex) {
            if(hex == null || !hex.matches("#[0-9a-fA-F]{6}")) return;
            int color = Color.parseColor(hex);
            runOnUiThread(() -> {
                getWindow().setStatusBarColor(color);
                getWindow().setNavigationBarColor(color);
                if(webView != null) webView.setBackgroundColor(color);
            });
        }
    }

    /** The phone's Back button navigates inside the app instead of immediately closing the lesson. */
    @Override public void onBackPressed() {
        if(webView == null || !HOME.equals(webView.getUrl())) {
            super.onBackPressed();
            return;
        }
        webView.evaluateJavascript("window.KidsBack ? window.KidsBack() : false", result -> {
            if(!"true".equals(result)) MainActivity.super.onBackPressed();
        });
    }

    @Override protected void onDestroy() {
        ttsReady = false;
        if(webView != null) {
            webView.removeJavascriptInterface("KidsAndroid");
            webView.destroy();
            webView = null;
        }
        if(tts != null) {
            tts.stop();
            tts.shutdown();
            tts = null;
        }
        super.onDestroy();
    }
}
