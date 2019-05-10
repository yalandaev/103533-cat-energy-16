'use strict';

var toogleMenu = document.querySelector('.page-header__toggle');
var navigation = document.querySelector('.main-nav');

navigation.classList.remove('main-nav--no-js');
toogleMenu.classList.remove('page-header__toggle--no-js');

toogleMenu.addEventListener('click', function() {
  toogleMenu.classList.toggle('page-header__toggle--close');
  navigation.classList.toggle('main-nav--open');
});
