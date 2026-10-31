// Единая настройка персонализации. Измените значения здесь, чтобы переименовать ребёнка в интерфейсе.
(function configureChildIdentity(){
 'use strict';
 const profile={
  name:'Ева',
  englishName:'Eva',
  genitive:'Евы',
  dative:'Еве',
  accusative:'Еву',
  age:6,
  companion:'Вулфи'
 };
 window.KIDS_IDENTITY=Object.freeze(profile);
})();
