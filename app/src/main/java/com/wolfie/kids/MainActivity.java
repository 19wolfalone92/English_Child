package com.wolfie.kids;

import android.app.Activity;
import android.content.Context;
import android.graphics.Color;
import android.os.Bundle;
import android.speech.tts.TextToSpeech;
import android.webkit.JavascriptInterface;
import android.webkit.WebResourceRequest;
import android.webkit.WebView;
import android.webkit.WebViewClient;
import android.view.View;
import java.util.Locale;

/** Completely offline. Native TTS and private progress are the only JavaScript bridge functions. */
public final class MainActivity extends Activity {
    private static final String HOME = "file:///android_asset/index.html";
    private WebView webView;
    private TextToSpeech tts;
    private volatile boolean ttsReady = false;

    @Override public void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        getWindow().setStatusBarColor(Color.rgb(255,249,236));
        getWindow().setNavigationBarColor(Color.rgb(255,249,236));
        int flags=View.SYSTEM_UI_FLAG_LIGHT_STATUS_BAR;
        if (android.os.Build.VERSION.SDK_INT>=26) flags|=View.SYSTEM_UI_FLAG_LIGHT_NAVIGATION_BAR;
        getWindow().getDecorView().setSystemUiVisibility(flags);

        tts=new TextToSpeech(this, status -> {
            if (status == TextToSpeech.SUCCESS && tts != null) {
                int result=tts.setLanguage(Locale.US);
                ttsReady=(result>=TextToSpeech.LANG_AVAILABLE);
                tts.setSpeechRate(0.83f);
            }
        });
        webView=new WebView(this);
        webView.setBackgroundColor(Color.rgb(255,249,236));
        webView.getSettings().setJavaScriptEnabled(true);
        webView.getSettings().setDomStorageEnabled(true);
        webView.getSettings().setAllowFileAccess(true);
        webView.getSettings().setAllowContentAccess(false);
        webView.getSettings().setAllowFileAccessFromFileURLs(false);
        webView.getSettings().setAllowUniversalAccessFromFileURLs(false);
        webView.getSettings().setBlockNetworkLoads(true);
        webView.addJavascriptInterface(new KidsBridge(getApplicationContext()),"KidsAndroid");
        webView.setWebViewClient(new WebViewClient() {
            @Override public boolean shouldOverrideUrlLoading(WebView view, WebResourceRequest request) {
                return !HOME.equals(request.getUrl().toString());
            }
        });
        setContentView(webView);
        webView.loadUrl(HOME);
    }

    private final class KidsBridge {
        private final Context context;
        KidsBridge(Context context){this.context=context;}
        @JavascriptInterface public String loadProgress(){
            return context.getSharedPreferences("wolfie_kids",Context.MODE_PRIVATE).getString("kids_progress_v1","{}");
        }
        @JavascriptInterface public void saveProgress(String data){
            if(data==null || data.length()>500000)return;
            context.getSharedPreferences("wolfie_kids",Context.MODE_PRIVATE).edit().putString("kids_progress_v1",data).apply();
        }
        @JavascriptInterface public boolean isSpeechAvailable(){return ttsReady;}
        @JavascriptInterface public void speak(String text){
            if(text==null || text.length()>350 || !ttsReady || tts==null)return;
            runOnUiThread(()->tts.speak(text,TextToSpeech.QUEUE_FLUSH,null,"kids-tts"));
        }
    }

    @Override protected void onDestroy(){
        ttsReady=false;
        if(webView!=null){
            webView.removeJavascriptInterface("KidsAndroid");
            webView.destroy();
            webView=null;
        }
        if(tts!=null){tts.stop();tts.shutdown();tts=null;}
        super.onDestroy();
    }
}
