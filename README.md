BPM-Engine
==========

SPA application (bionic)

Результат предполагается использовать в реальном проекте.
Это система управления документами и процессами. Сейчас подобное решение построено на базе Drupal
с модулем Maestro. Но... Поскольку это всё-таки система, имеющая дело с документами, 
хотелось бы обратить внимание на noSQL СУБД.
Сначала рассматривался MongoDB  + Node.js + Express. На занятиях в Bionic University мы познакомились с noSQL СУБД, для которой не надо дополнительно докручивать RESTful API - Apache CouchDB. Её и выбрали. А поскольку 
планируется написать фронт-энд этого решения именно опираясь исключительно на возможности JavaScript и JavaScript-фреймворков, то был выбран Durandal + Knockout. Итак, JavaScript, реализующий клиентскую и серверную часть веб-приложения с прямым доступом к СУБД.
Также были изучены статьи, посвящённые сравнению CouchDB и MongoDB и выбор снова был сделан в пользу CouchDB.
