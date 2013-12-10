define(['couchDB', 'durandal/system'],
  function(db, system) {

    var svg,
      modeDrawLine = false,
      readonly = false,
      from = null,
      count = 0,
      tasksCount = 0,
      conditionsCount = 0,
      functionsCount = 0,
      linesCount = 0,
      lineType = 'simple',
      vars = [],
      blocks = [],
      template = null,
      globalTarget,
      self = {
        initialize  : initialize,
        newTemplate : newTemplate,
        editTemplate: editTemplate,
        saveTemplate: saveTemplate,
        viewWorkflow: viewWorkflow
      }

    return self;
    
     function init() {
      modeDrawLine = false;
      readonly = false;
      from = null;
      count = 0;
      tasksCount = 0;
      conditionsCount = 0;
      functionsCount = 0;
      linesCount = 0;
      lineType = 'simple';
      vars = [];
      blocks = [];
      template = null;
     }
     
    function createBlock(etalon, x, y, title) {
      count++;
      var id = 'block' + count;
      var $el = etalon.clone().appendTo('#svg');
      var type;
      $el.attr('id', id);
      $el.css('top', y);
      $el.css('left', x);
      $el.draggable();
      $el.bind('click', function(event, ui) {
        //system.log(this);
        if(modeDrawLine) {
          drawLine(from, this);
          modeDrawLine = false;
        }
        else {
          //system.log(getXY(this));
        }
      });
      $el.bind('drag', function(event, ui) {
        var x = $(this).position().left,
          y = $(this).position().top,
          block = getBlock(id);
        block.x = x;
        block.y = y;
        //system.log(blocks);
      });
      var $header = $el.find('.header').text(title);
      $header.removeClass('ui-widget-header ui-widget-header-red ui-widget-header-green ui-widget-header-orange ui-widget-header-blue');
      if(etalon.hasClass('task')) {
        if(title == 'Начало') {
          type = 'start';
          $el.addClass('begin');
          $header.addClass('ui-widget-header-green');
        }
        else if(title == 'Конец') {
          type = 'end';
          $el.addClass('end');
          $header.addClass('ui-widget-header-red');
        }
        else {
          type = 'task';
          $header.addClass('ui-widget-header-blue');
        }
      }
      if(etalon.hasClass('condition')) {
        type = 'condition';
        $header.addClass('ui-widget-header-orange');
      }
      if(etalon.hasClass('function')) {
        type = 'function';
        $header.addClass('ui-widget-header');
      }
      $el.show();
      blocks.push({'id': id, 'title': title, 'type': type, 'x': x, 'y': y, 'linesFrom': [], 'linesTo': []});
      //system.log(blocks);
    }

    function getBlock(id) {
      for(var i = 0; i < blocks.length; i++) {
        if(blocks[i].id == id) {
          return blocks[i];
        }
      }
      return null;
    }

    function addLineFrom(blockId, lineId) {
      if(lineType != 'simple') {
        getBlock(blockId).linesFrom.push({id: lineId, type: lineType});
      }
      else {
        getBlock(blockId).linesFrom.push({id: lineId});
      }
    }

    function addLineTo(blockId, lineId) {
      getBlock(blockId).linesTo.push({id: lineId});
    }

    function clearLinesFrom(blockId) {
      var deletedLines = [],
        block = getBlock(blockId);
      for(var j = 0; j < block.linesFrom.length; j++) {
        $('#' + block.linesFrom[j].id).remove();
        deletedLines.push(block.linesFrom[j].id);
      }
      block.linesFrom = [];
      removeLines(deletedLines);
    }

    function clearLinesTo(blockId) {
      var deletedLines = [],
        block = getBlock(blockId);
      for(var j = 0; j < block.linesTo.length; j++) {
        $('#' + block.linesTo[j].id).remove();
        deletedLines.push(block.linesTo[j].id);
      }
      block.linesTo = [];
      removeLines(deletedLines);
    }

    function removeLines(deletedLines) {
      for(var i = 0; i < blocks.length; i++) {
        for(var j = 0; j < blocks[i].linesTo.length; j++) {
          if(deletedLines.indexOf(blocks[i].linesTo[j]) != -1) {
            blocks[i].linesTo.splice(j, 1);
          }
        }
        for(var j = 0; j < blocks[i].linesFrom.length; j++) {
          if(deletedLines.indexOf(blocks[i].linesFrom[j]) != -1) {
            blocks[i].linesFrom.splice(j, 1);
          }
        }
      }
    }

    function removeBlock(id) {
      clearLinesFrom(id);
      clearLinesTo(id);
      $('#' + id).remove();
      for(var i = 0; i < blocks.length; i++) {
        if(blocks[i].id == id) {
          blocks.splice(i, 1);
          break;
        }
      }
      //system.log(blocks);
    }

    function initSvg(_svg) {
      svg = _svg;
    }

    function getXY(elem) {
      //system.log(elem);
      var x = $(elem).position().left,
        y = $(elem).position().top,
        w = $(elem).width(),
        h = $(elem).height();
      return {x: x + w / 2, y: y + h / 2};
      //return {x:x, y:y};
    }

    function drawLine(r1, r2) {
      linesCount++;

      /*system.log('r1:');
       system.log(r1);
       system.log('r2:');
       system.log(r2);*/

      var r1xy = getXY(r1);
      var r2xy = getXY(r2);
      var color = 'black';

      if(lineType == 'false') {
        color = 'red';
      }

      var triangle = svg.marker(svg.defs(), 'triangle', 0, 5, 4, 3, 'auto', {viewBox: '0 0 10 10'});
      svg.path(triangle, 'M 0 0 L 10 5 L 0 10 z');
      var con = svg.line(
        r1xy.x, r1xy.y,
        r2xy.x, r2xy.y, {stroke: color, strokeWidth: 2/*, markerEnd: "url(#triangle)"*/});

      con.id = 'line' + linesCount;

      //system.log(con);

      $(r1).bind('drag', function(event, ui) {
        var xy = getXY(this);
        con.setAttribute('x1', xy.x);
        con.setAttribute('y1', xy.y);
      });

      $(r2).bind('drag', function(event, ui) {
        var xy = getXY(this);
        /*var conxy = {x1: con.getAttribute('x1'), y1: con.getAttribute('y1'), x2: con.getAttribute('x2'), y2: con.getAttribute('y2')};
         if (xy.y > conxy.y1 - 50 && xy.y < conxy.y1 + 50) {
         if (xy.x < conxy.x1) {
         con.setAttribute('x2', xy.x + 150);
         } else {
         con.setAttribute('x2', xy.x);
         }
         } else {
         con.setAttribute('x2', xy.x + 150/2);
         }
         if (xy.y < conxy.y1) {
         con.setAttribute('y2', xy.y + 100);
         } else {
         con.setAttribute('y2', xy.y);
         }*/
        con.setAttribute('x2', xy.x);
        con.setAttribute('y2', xy.y);
      });

      addLineFrom($(r1).attr('id'), con.id);
      addLineTo($(r2).attr('id'), con.id);

      //system.log(blocks);
    }

    function isVarExists(varName) {
      for(var i = 0; i < vars.length; i++) {
        if(vars[i].name == varName) {
          return true;
        }
      }
      return false;
    }

    function addVar(varName, varValue) {
      if(!isVarExists(varName)) {
        vars.push({name: varName, val: varValue});
        return true;
      }
      return false;
    }

    function getVar(varName) {
      for(var i = 0; i < vars.length; i++) {
        if(vars[i].name === $.trim(varName)) {
          return vars[i];
        }
      }
      return null;
    }

    function editVar(varName, varValue) {
      var variable = getVar(varName);
      if(variable != null) {
        variable.val = varValue;
        return true;
      }
      return false;
    }

    function delVar(varName) {
      for(var i = 0; i < vars.length; i++) {
        if(vars[i].name === $.trim(varName)) {
          vars.splice(i, 1);
          return true;
        }
      }
      return false;
    }

    function prepareVariableDialog() {

      var name = $("#variable_name"),
        value = $("#variable_value"),
        mode = $("#variable_mode");
      allFields = $([]).add(name).add(value),
        tips = $(".validateTips");
      mode.val('add');

      function updateTips(t) {
        tips
          .text(t)
          .addClass("ui-state-highlight");
        setTimeout(function() {
          tips.removeClass("ui-state-highlight", 1500);
        }, 500);
      }

      function checkLength(o, n, min, max) {
        if(o.val().length > max || o.val().length < min) {
          o.addClass("ui-state-error");
          updateTips("Длина имени переменной должна быть от " +
            min + " до " + max + " символов.");
          return false;
        }
        else {
          return true;
        }
      }

      function checkRegexp(o, regexp, n) {
        if(!( regexp.test(o.val()) )) {
          o.addClass("ui-state-error");
          updateTips(n);
          return false;
        }
        else {
          return true;
        }
      }

      $("#dialog-form-variable").dialog({
        autoOpen: false,
        height  : 250,
        width   : 280,
        modal   : true,
        buttons : [
          {
            id   : "button_var_save",
            text : "Сохранить",
            click: function() {
              var bValid = true;
              allFields.removeClass("ui-state-error");

              bValid = bValid && checkLength(name, "name", 1, 32);
              bValid = bValid && checkRegexp(name, /^[a-z]([0-9a-z_])+$/i, "Имя переменной должно содержать только латинские буквы, цифры, знаки подчёркивания и начинаться с буквы.");

              if(bValid) {
                if(mode.val() == 'add') {
                  // Добавляем переменную
                  if(!addVar(name.val(), value.val())) {
                    name.addClass("ui-state-error");
                    updateTips("Такая переменная уже существует.");
                  }
                  else {
                    $(this).dialog("close");
                  }
                }
                if(mode.val() == 'edit') {
                  // Изменяем переменную
                  if(!editVar(name.val(), value.val())) {
                    name.addClass("ui-state-error");
                    updateTips("Переменная не найдена.");
                  }
                  else {
                    $(this).dialog("close");
                  }
                }
              }
            }
          },
          {
            id   : "button_var_del",
            text : "Удалить",
            click: function() {
              // Удаляем переменную
              if(!delVar(name.val())) {
                name.addClass("ui-state-error");
                updateTips("Переменная не найдена.");
              }
              else {
                $(this).dialog("close");
              }
            }
          },
          {
            id   : "button_var_cancel",
            text : "Отмена",
            click: function() {
              $(this).dialog("close");
            }
          }
        ],
        close   : function() {
          allFields.val("").removeClass("ui-state-error");
          tips.text('Поле "Имя переменной" - обязательное.');
        }
      });

    }

    function editTask(taskId, title, users) {
      var task = getBlock(taskId);
      if(task != null) {
        task.title = title;
        task.users = users;
        $('#' + taskId).find('.header').text(title);
        var bodyText = "";
        for(var i = 0; i < users.length; i++) {
          bodyText += users[i] + "<br>";
        }
        $('#' + taskId).find('.blockText').html(bodyText);
        return true;
      }
      return false;
    }

    function prepareTaskDialog() {

      var title = $("#task_title"),
        users = $("#task_users"),
        task_id = $("#task_id"),
        allFields = $([]).add(title).add(users),
        tips = $(".validateTips");

      function updateTips(t) {
        tips
          .text(t)
          .addClass("ui-state-highlight");
        setTimeout(function() {
          tips.removeClass("ui-state-highlight", 1500);
        }, 500);
      }

      function checkLength(o, min, max) {
        if(o.val().length > max || o.val().length < min) {
          o.addClass("ui-state-error");
          updateTips("Длина названия задания должна быть от " +
            min + " до " + max + " символов.");
          return false;
        }
        else {
          return true;
        }
      }

      function checkSelect(o) {
        //system.log(o.val());
        if(o.val() == null) {
          o.addClass("ui-state-error");
          updateTips("Необходимо назначить исполнителей.");
          return false;
        }
        else {
          return true;
        }
      }

      function checkRegexp(o, regexp, n) {
        if(!( regexp.test(o.val()) )) {
          o.addClass("ui-state-error");
          updateTips(n);
          return false;
        }
        else {
          return true;
        }
      }

      $("#dialog-form-task").dialog({
        autoOpen: false,
        height  : 250,
        width   : 280,
        modal   : true,
        buttons : [
          {
            id   : "button_task_save",
            text : "Сохранить",
            click: function() {
              var bValid = true;
              allFields.removeClass("ui-state-error");

              bValid = bValid && checkLength(title, 1, 255);
              bValid = bValid && checkSelect(users);

              if(bValid) {
                // Изменяем задание
                if(!editTask(task_id.val(), title.val(), users.val())) {
                  title.addClass("ui-state-error");
                  updateTips("Ошибка сохранения задания.");
                }
                else {
                  //system.log(blocks);
                  $(this).dialog("close");
                }
              }
            }
          },
          {
            id   : "button_task_cancel",
            text : "Отмена",
            click: function() {
              $(this).dialog("close");
            }
          }
        ],
        close   : function() {
          allFields.val("").removeClass("ui-state-error");
          tips.text("Все поля обязательны для заполнения.");
        }
      });

    }

    function editFunction(blockId, title, funcName) {
      var block = getBlock(blockId);
      if(block != null) {
        block.title = title;
        block.func = funcName;
        $('#' + blockId).find('.header').text(title);
        $('#' + blockId).find('.blockText').html(funcName);
        return true;
      }
      return false;
    }

    function prepareFunctionDialog() {

      var title = $("#function_title"),
        func = $("#function_function"),
        block_id = $("#block_id"),
        allFields = $([]).add(title).add(func),
        tips = $(".validateTips");

      function updateTips(t) {
        tips
          .text(t)
          .addClass("ui-state-highlight");
        setTimeout(function() {
          tips.removeClass("ui-state-highlight", 1500);
        }, 500);
      }

      function checkLength(o, n, min, max) {
        if(o.val().length > max || o.val().length < min) {
          o.addClass("ui-state-error");
          updateTips('Длина поля "' + n + '" должна быть от ' +
            min + " до " + max + " символов.");
          return false;
        }
        else {
          return true;
        }
      }

      function checkRegexp(o, regexp, n) {
        if(!( regexp.test(o.val()) )) {
          o.addClass("ui-state-error");
          updateTips(n);
          return false;
        }
        else {
          return true;
        }
      }

      $("#dialog-form-function").dialog({
        autoOpen: false,
        height  : 250,
        width   : 280,
        modal   : true,
        buttons : [
          {
            id   : "button_function_save",
            text : "Сохранить",
            click: function() {
              var bValid = true;
              allFields.removeClass("ui-state-error");

              bValid = bValid && checkLength(title, 'Название блока функции', 1, 255);
              bValid = bValid && checkLength(func, 'Имя функции', 1, 32);
              bValid = bValid && checkRegexp(func, /^[a-z]([0-9a-z_])+$/i, "Имя функции должно содержать только латинские буквы, цифры, знаки подчёркивания и начинаться с буквы.");

              if(bValid) {
                // Изменяем функцию
                if(!editFunction(block_id.val(), title.val(), func.val())) {
                  func.addClass("ui-state-error");
                  updateTips("Ошибка сохранения функции.");
                }
                else {
                  //system.log(blocks);
                  $(this).dialog("close");
                }
              }
            }
          },
          {
            id   : "button_function_cancel",
            text : "Отмена",
            click: function() {
              $(this).dialog("close");
            }
          }
        ],
        close   : function() {
          allFields.val("").removeClass("ui-state-error");
          tips.text("Все поля обязательны для заполнения.");
        }
      });

    }

    function editCondition(blockId, title, varName, varValue) {
      var block = getBlock(blockId);
      if(block != null) {
        block.title = title;
        block.variable = varName;
        block.val = varValue;
        $('#' + blockId).find('.header').text(title);
        $('#' + blockId).find('.blockText').html(varName + '=' + varValue);
        return true;
      }
      return false;
    }

    function prepareConditionDialog() {

      var title = $("#condition_title"),
        variable = $("#condition_vars"),
        value = $("#condition_value"),
        block_id = $("#condition_block_id"),
        allFields = $([]).add(title).add(variable).add(value),
        tips = $(".validateTips");

      function updateTips(t) {
        tips
          .text(t)
          .addClass("ui-state-highlight");
        setTimeout(function() {
          tips.removeClass("ui-state-highlight", 1500);
        }, 500);
      }

      function checkLength(o, n, min, max) {
        if(o.val().length > max || o.val().length < min) {
          o.addClass("ui-state-error");
          updateTips('Длина поля "' + n + '" должна быть от ' +
            min + " до " + max + " символов.");
          return false;
        }
        else {
          return true;
        }
      }

      function checkSelect(o) {
        //system.log(o.val());
        if(o.val() == null) {
          o.addClass("ui-state-error");
          updateTips("Необходимо выбрать переменную.");
          return false;
        }
        else {
          return true;
        }
      }

      function checkRegexp(o, regexp, n) {
        if(!( regexp.test(o.val()) )) {
          o.addClass("ui-state-error");
          updateTips(n);
          return false;
        }
        else {
          return true;
        }
      }

      $("#dialog-form-condition").dialog({
        autoOpen: false,
        height  : 250,
        width   : 280,
        modal   : true,
        buttons : [
          {
            id   : "button_condition_save",
            text : "Сохранить",
            click: function() {
              var bValid = true;
              allFields.removeClass("ui-state-error");

              bValid = bValid && checkLength(title, 'Название блока условия', 1, 255);
              bValid = bValid && checkSelect(variable);
              bValid = bValid && checkLength(value, 'Значение', 1, 255);

              if(bValid) {
                // Изменяем условие
                if(!editCondition(block_id.val(), title.val(), variable.val(), value.val())) {
                  variable.addClass("ui-state-error");
                  updateTips("Ошибка сохранения условия.");
                }
                else {
                  //system.log(blocks);
                  $(this).dialog("close");
                }
              }
            }
          },
          {
            id   : "button_condition_cancel",
            text : "Отмена",
            click: function() {
              $(this).dialog("close");
            }
          }
        ],
        close   : function() {
          allFields.val("").removeClass("ui-state-error");
          tips.text("Все поля обязательны для заполнения.");
        }
      });

    }

    function editTemplateTitle(title) {
      template.title = title;
      return true;
    }

    function prepareTemplateDialog() {

      var title = $("#template_title"),
        allFields = $([]).add(title),
        tips = $(".validateTips");

      function updateTips(t) {
        tips
          .text(t)
          .addClass("ui-state-highlight");
        setTimeout(function() {
          tips.removeClass("ui-state-highlight", 1500);
        }, 500);
      }

      function checkLength(o, n, min, max) {
        if(o.val().length > max || o.val().length < min) {
          o.addClass("ui-state-error");
          updateTips('Длина поля "' + n + '" должна быть от ' +
            min + " до " + max + " символов.");
          return false;
        }
        else {
          return true;
        }
      }

      $("#dialog-form-template").dialog({
        autoOpen: false,
        height  : 250,
        width   : 280,
        modal   : true,
        buttons : [
          {
            id   : "button_template_save",
            text : "Сохранить",
            click: function() {
              var bValid = true;
              allFields.removeClass("ui-state-error");

              bValid = bValid && checkLength(title, 'Название сценария', 1, 255);

              if(bValid) {
                // Изменяем название сценария
                if(!editTemplateTitle(title.val())) {
                  title.addClass("ui-state-error");
                  updateTips("Ошибка сохранения названия сценария.");
                }
                else {
                  //system.log(blocks);
                  $(this).dialog("close");
                }
              }
            }
          },
          {
            id   : "button_template_cancel",
            text : "Отмена",
            click: function() {
              $(this).dialog("close");
            }
          }
        ],
        close   : function() {
          allFields.val("").removeClass("ui-state-error");
          tips.text('Поле "Название сценария" обязательно для заполнения.');
        }
      });

    }

    function getBlockDiv($target) {
      if(!$target.hasClass('task') && !$target.hasClass('function') && !$target.hasClass('condition')) {
        return $target.parent()[0];
      }
      else {
        return $target[0];
      }
    }

    function prepareTemplateEditor() {

      $('#svg').svg({onLoad: initSvg});

      $('#svg-container').contextmenu({
        delegate     : ".hasmenu2",
        preventSelect: true,
        taphold      : true,
        menu         : [
          {title  : "Задание", uiIcon: "ui-icon-newwin",
            action: function(event, ui) {
              tasksCount++;
              createBlock($('#task'), event.clientX, event.clientY, 'Задание ' + tasksCount);
              $('.ui-menu').fadeOut(300);
            }
          },
          {title  : "Функция", uiIcon: "ui-icon-newwin",
            action: function(event, ui) {
              functionsCount++;
              createBlock($('#function'), event.clientX, event.clientY, 'Функция ' + functionsCount);
              $('.ui-menu').fadeOut(300);
            }
          },
          {title  : "Условие", uiIcon: "ui-icon-newwin",
            action: function(event, ui) {
              conditionsCount++;
              createBlock($('#condition'), event.clientX, event.clientY, 'Условие ' + conditionsCount);
              $('.ui-menu').fadeOut(300);
            }
          },
          {title: "-"
          },
          {title  : "Добавить переменную", uiIcon: "ui-icon-plus",
            action: function(event, ui) {
              $("#dialog-form-variable").dialog("open").dialog("option", "title", "Добавление переменной");
              $("#button_var_del").hide();
              $("#variable_mode").val('add');
              $('.ui-menu').fadeOut(300);
            }
          },
          {title: "Переменные", cmd: "variables"},
          {title: "-"
          },
          {title  : "Название сценария", uiIcon: "ui-icon-pencil",
            action: function(event, ui) {
              var $target = ui.target,
                title = $("#template_title");
              $("#dialog-form-template").dialog("open");
              title.val(template.title);
              $('.ui-menu').fadeOut(300);
            }
          },
          {title  : "Сохранить сценарий", uiIcon: "ui-icon-disk",
            action: function(event, ui) {
              saveTemplate().then(function(result) {
                //system.log('Updated Template:');
                //system.log(result);
              });
              $('.ui-menu').fadeOut(300);
            }
          }
        ],
        beforeOpen   : function(event, ui) {
          if(!readonly) {
            var $menu = ui.menu,
              $target = ui.target
            vars_names = [];
            for(var i = 0; i < vars.length; i++) {
              vars_names.push({title: vars[i].name, uiIcon: "ui-icon-script", cmd: "editVar" + i,
                action              : function(event, ui) {
                  var $menuitem = ui.item;
                  $("#dialog-form-variable").dialog("open").dialog("option", "title", "Изменение/удаление переменной");
                  $("#button_var_del").show();
                  var name = $("#variable_name"),
                    value = $("#variable_value"),
                    mode = $("#variable_mode"),
                    var_name = $menuitem[0].innerText;
                  mode.val('edit');
                  name.val(var_name);
                  if(getVar(var_name) != null) {
                    value.val(getVar(var_name).val);
                  }
                  $('.ui-menu').fadeOut(300);
                }
              });
            }
            console.log(vars_names);
            $('#svg-container').contextmenu("setEntry", "variables", {title: "Переменные", cmd: "variables", children: vars_names});
            return ($target[0].tagName == 'svg');
          }
          else {
            return false;
          }
        }
      });

      $(".hasmenu2").contextmenu({
        delegate     : ".hasmenu",
        preventSelect: true,
        taphold      : true,
        menu         : [
          {title  : "Дублировать блок", cmd: "duplicate", uiIcon: "ui-icon-copy",
            action: function(event, ui) {
              var $target = ui.target;
              //$target = $(getBlockDiv($target));
              $target = globalTarget;
              if($target.hasClass('task')) {
                tasksCount++;
                createBlock($target, parseInt($target.css('left')) + 10, parseInt($target.css('top')) + 10, 'Задание ' + tasksCount);
              }
              if($target.hasClass('function')) {
                functionsCount++;
                createBlock($target, parseInt($target.css('left')) + 10, parseInt($target.css('top')) + 10, 'Функция ' + functionsCount);
              }
              if($target.hasClass('condition')) {
                conditionsCount++;
                createBlock($target, parseInt($target.css('left')) + 10, parseInt($target.css('top')) + 10, 'Условие ' + conditionsCount);
              }
              $('.ui-menu').fadeOut(300);
            }
          },
          {title  : "Переход", cmd: "pathTrue", uiIcon: "ui-icon-link",
            action: function(event, ui) {
              modeDrawLine = true;
              lineType = 'simple';
              var $target = ui.target;
              //from = getBlockDiv($target);
              from = globalTarget;
              $('.ui-menu').fadeOut(300);
            }
          },
          {title  : "Переход false", cmd: "pathFalse", uiIcon: "ui-icon-link",
            action: function(event, ui) {
              modeDrawLine = true;
              lineType = 'false';
              var $target = ui.target;
              //from = getBlockDiv($target);
              from = globalTarget;
              $('.ui-menu').fadeOut(300);
            }
          },
          {title  : "Редактировать задание", cmd: "editTask", uiIcon: "ui-icon-pencil",
            action: function(event, ui) {
              db.getUsers().then(function(db_users) {
                var $target = ui.target,
                  title = $("#task_title"),
                  users = $("#task_users"),
                  user;
                //$target = $(getBlockDiv($target));
                $target = globalTarget;
                //system.log($target);
                var task = getBlock($target.attr('id'));
                if(task != null) {
                  $("#dialog-form-task").dialog("open");
                  title.val(task.title);
                  users.find('option').remove();
                  for(var i = 0; i < db_users.length; i++) {
                    user = db_users[i]['value'].name;
                    users.append($('<option value="' + user + '">' + user + '</option>'));
                  }
                  users.val(task.users);
                  $("#task_id").val(task.id);
                }
                $('.ui-menu').fadeOut(300);
              });
            }
          },
          {title  : "Редактировать блок функции", cmd: "editFunction", uiIcon: "ui-icon-pencil",
            action: function(event, ui) {
              var $target = ui.target,
                title = $("#function_title"),
                func = $("#function_function");
              //$target = $(getBlockDiv($target));
              $target = globalTarget;
              block = getBlock($target.attr('id'));
              $("#dialog-form-function").dialog("open");
              title.val(block.title);
              func.val(block.func);
              $("#block_id").val(block.id);
              $('.ui-menu').fadeOut(300);
            }
          },
          {title  : "Редактировать условие", cmd: "editCondition", uiIcon: "ui-icon-pencil",
            action: function(event, ui) {
              var $target = ui.target,
                title = $("#condition_title"),
                condition_vars = $("#condition_vars"),
                condition_value = $("#condition_value"),
                variable;
              //$target = $(getBlockDiv($target));
              $target = globalTarget;
              block = getBlock($target.attr('id'));
              $("#dialog-form-condition").dialog("open");
              title.val(block.title);
              condition_vars.find('option').remove();
              for(var i = 0; i < vars.length; i++) {
                variable = vars[i].name;
                condition_vars.append($('<option value="' + variable + '">' + variable + '</option>'));
              }
              condition_vars.val(block.variable);
              condition_value.val(block.val);
              $("#condition_block_id").val(block.id);
              $('.ui-menu').fadeOut(300);
            }
          },
          {title: "-"
          },
          {title  : "Удалить исходящие переходы", cmd: "removeLinesFrom", uiIcon: "ui-icon-cancel",
            action: function(event, ui) {
              var $target = ui.target;
              //$target = $(getBlockDiv($target));
              $target = globalTarget;
              clearLinesFrom($target.attr('id'));
              $('.ui-menu').fadeOut(300);
            }
          },
          {title  : "Удалить входящие переходы", cmd: "removeLinesTo", uiIcon: "ui-icon-cancel",
            action: function(event, ui) {
              var $target = ui.target;
              //$target = $(getBlockDiv($target));
              $target = globalTarget;
              clearLinesTo($target.attr('id'));
              $('.ui-menu').fadeOut(300);
            }
          },
          {title  : "Удалить блок", cmd: "removeBlock", uiIcon: "ui-icon-cancel",
            action: function(event, ui) {
              var $target = ui.target;
              //$target = $(getBlockDiv($target));
              $target = globalTarget;
              removeBlock($target.attr('id'));
              $('.ui-menu').fadeOut(300);
            }
          }
        ],
        beforeOpen   : function(event, ui) {
          if(!readonly) {
            var $menu = ui.menu,
              $target = ui.target;
            $target = $(getBlockDiv($target));
            //system.log($target.attr('id'));
            globalTarget = $target;
            if($target.hasClass('condition')) {
              $('.hasmenu2')
                .contextmenu("setEntry", "pathTrue", "Переход true")
                .contextmenu("setEntry", "pathFalse", "Переход false")
                .contextmenu("showEntry", "pathFalse", true);
            }
            else {
              $('.hasmenu2')
                .contextmenu("setEntry", "pathTrue", "Переход")
                .contextmenu("showEntry", "pathFalse", false);
            }

            if($target.hasClass('begin')) {
              $('.hasmenu2')
                .contextmenu("showEntry", "duplicate", false)
                .contextmenu("showEntry", "removeBlock", false)
                .contextmenu("showEntry", "removeLinesTo", false)
                .contextmenu("showEntry", "removeLinesFrom", true)
                .contextmenu("showEntry", "pathTrue", true);
            }
            else if($target.hasClass('end')) {
              $('.hasmenu2')
                .contextmenu("showEntry", "duplicate", false)
                .contextmenu("showEntry", "removeBlock", false)
                .contextmenu("showEntry", "removeLinesTo", true)
                .contextmenu("showEntry", "removeLinesFrom", false)
                .contextmenu("showEntry", "pathTrue", false);
            }
            else {
              $('.hasmenu2')
                .contextmenu("showEntry", "duplicate", true)
                .contextmenu("showEntry", "removeBlock", true)
                .contextmenu("showEntry", "removeLinesTo", true)
                .contextmenu("showEntry", "removeLinesFrom", true)
                .contextmenu("showEntry", "pathTrue", true);
            }

            $('.hasmenu2')
              .contextmenu("showEntry", "editTask", false)
              .contextmenu("showEntry", "editFunction", false)
              .contextmenu("showEntry", "editCondition", false);

            if($target.hasClass('task') && !$target.hasClass('begin') && !$target.hasClass('end')) {
              $('.hasmenu2')
                .contextmenu("showEntry", "editTask", true);
            }

            if($target.hasClass('function')) {
              $('.hasmenu2')
                .contextmenu("showEntry", "editFunction", true);
            }

            if($target.hasClass('condition')) {
              $('.hasmenu2')
                .contextmenu("showEntry", "editCondition", true);
            }

          }
          else {
            return false;
          }

        }
      });

    }

    function initialize() {
      init();
      var deferred = Q.defer();
      prepareVariableDialog();
      prepareTaskDialog();
      prepareFunctionDialog();
      prepareConditionDialog();
      prepareTemplateDialog();
      prepareTemplateEditor();
      deferred.resolve({prepared: true});
      return deferred.promise;
    }

    function newTemplate() {
      init();
      createBlock($('#task'), 400, 8, 'Начало');
      createBlock($('#task'), 400, 500, 'Конец');
    }

    function getTemplate(templateId) {
      var deferred = Q.defer();
      db.getDocs('_design/templates/_view/all?key="' + templateId + '"').then(function(result) {
        deferred.resolve(result);
      });
      return deferred.promise;
    }

    function getWorkflow(workflowId) {
      var deferred = Q.defer();
      db.getDocs('_design/workflows/_view/all?key="' + workflowId + '"').then(function(result) {
        deferred.resolve(result);
      });
      return deferred.promise;
    }

    function getLineToBlock(blocks, lineId) {
      var block, lineTo;
      for(var i = 0; i < blocks.length; i++) {
        block = blocks[i];
        for(var j = 0; j < block.linesTo.length; j++) {
          lineTo = block.linesTo[j];
          if(lineTo.id == lineId) {
            return blocks[i].id;
          }
        }
      }
      return '';
    }

    function editTemplate(templateId) { //b39a10d39242373069c6d891060097c0
      init();
      var deferred = Q.defer();
      getTemplate(templateId).then(function(result) {
        template = result[0]['value'];
        vars = template.vars;
        var block;
        for(var i = 0; i < template.blocks.length; i++) {
          block = template.blocks[i];
          //system.log(block);
          if(block.type == 'start') {
            createBlock($('#task'), block.x, block.y, 'Начало');
          }
          if(block.type == 'end') {
            createBlock($('#task'), block.x, block.y, 'Конец');
          }
          if(block.type == 'task') {
            tasksCount++;
            createBlock($('#task'), block.x, block.y, 'Задание ' + tasksCount);
            if(block.title != undefined) {
              editTask(block.id, block.title, block.users);
            }
            else {
              editTask(block.id, 'Задание ' + tasksCount, block.users);
            }
          }
          if(block.type == 'function') {
            functionsCount++;
            createBlock($('#function'), block.x, block.y, 'Функция ' + functionsCount);
            if(block.title != undefined) {
              editFunction(block.id, block.title, block.func);
            }
            else {
              editFunction(block.id, 'Функция ' + functionsCount, block.func);
            }
          }
          if(block.type == 'condition') {
            conditionsCount++;
            createBlock($('#condition'), block.x, block.y, 'Условие ' + conditionsCount);
            if(block.title != undefined) {
              editCondition(block.id, block.title, block.variable, block.val);
            }
            else {
              editCondition(block.id, 'Условие ' + conditionsCount, block.variable, block.val);
            }
          }
        }
        var lineFrom,
          blockFrom,
          blockTo;
        for(var i = 0; i < template.blocks.length; i++) {
          block = template.blocks[i];
          for(var j = 0; j < block.linesFrom.length; j++) {
            lineFrom = block.linesFrom[j];
            blockFrom = $("#" + block.id);
            blockTo = $("#" + getLineToBlock(result[0]['value'].blocks, lineFrom.id));
            if(blockTo) {
              lineType = lineFrom.type;
              drawLine(blockFrom[0], blockTo[0]);
            }
          }
        }
        template.vars = vars;
        template.blocks = blocks;
        deferred.resolve(result);
      });
      return deferred.promise;
    }

    function saveTemplate() {
      var deferred = Q.defer();
      if(template != null) {
        //system.log('Before Save Template:');
        //system.log(template);
        db.updateDoc(template._id, template).then(function(result) {
          deferred.resolve(result);
        });
      }
      else {
        template = {
          title : 'New template',
          type  : 'template',
          vars  : vars,
          blocks: blocks
        }
        db.createDoc(template).then(function(result) {
          deferred.resolve(result);
        });
      }
      return deferred.promise;
    }

    function getWorkflowBlocks(workflowId) {
      var deferred = Q.defer();
      db.getDocs('_design/workflow_blocks/_view/all?key="' + workflowId + '"').then(function(result) {
        deferred.resolve(result);
      });
      return deferred.promise;
    }

    function setBlockColor(blockId, color, hint) {
      if(getBlock(blockId) != null) {
        $('#' + blockId).css('background', color).attr('title', hint);
      }
    }

    function viewWorkflow(workflowId) {
      init();
      readonly = true;
      var deferred = Q.defer();
      getWorkflow(workflowId).then(function(res1) {
        var templateId = res1[0]['value'].templateId;
        editTemplate(templateId).then(function(res2) {
          getWorkflowBlocks(workflowId).then(function(res3) {
            //system.log('Workflow Blocks:');
            //system.log(res3);
            var blocks = res3,
              block;
            for(var i = 0; i < blocks.length; i++) {
              block = blocks[i]['value'];
              if(block.status == 'commited') {
                setBlockColor(block.id, '#77D5F7', 'Блок отработан');
              }
              if(block.status == 'waiting') {
                setBlockColor(block.id, '#C2DDB6', 'Текущий блок');
              }
            }
          });
          deferred.resolve(res1);
        });
      });
      return deferred.promise;
    }

  });
