define(['viewmodels/user/createCard'], function(viewModel) {

  var
    engine = require('services/bpmEngine'),
    db = require('couchDB'),
    appSecurity = require('services/appSecurity'),
    app = require('durandal/app'),
    router = require('plugins/router')
    ;


    describe('viewModel [createCard]',function(){

      beforeEach(function () {

        var matchers = {
          toBeComputed: function () {
            this.message = function () {
              return "Expected to be computed";
            };

            return ko.isComputed(this.actual);
          }
        };

        this.addMatchers(matchers);
      });

      it('should be object', function(){
        expect(viewModel).toEqual(jasmine.any(Object));
      });

      describe('documentNumber:', function () {

        it('should be defined', function () {
          expect(viewModel.documentNumber).toBeDefined();
        });

      });

      describe('text:', function () {

        it('should be defined', function () {
          expect(viewModel.text).toBeDefined();
        });

      });


      describe('selectedWorkflow:', function(){
        it('should be defined', function(){
          expect(viewModel.selectedWorkflow).toBeDefined();
        })

      });

      describe('createCard', function(){
        it('shoul be function', function(){
          expect(viewModel.createCard).toEqual(jasmine.any(Function));
        })
      });


      describe('canSave', function(){
        it('should be computed', function(){
          expect(viewModel.canSave).toBeComputed();
        });

        describe('when documentNumber is empty', function () {

          it('should be false', function () {
            viewModel.documentNumber('');
            expect(viewModel.canSave()).toBeFalsy();
          });

        });

        describe('when text is empty', function () {

          it('should be false', function () {
            viewModel.text('');
            expect(viewModel.canSave()).toBeFalsy();
          });

        });

        describe('when fields not empty', function(){

          it('should be true', function(){
            viewModel.documentNumber('documentNumber');
            viewModel.text('text');
            viewModel.selectedWorkflow('selectedWorkflow');
            viewModel.file({files:{length:1}});

            expect(viewModel.canSave()).toBeTruthy();

          });

        });

      });

    });


});
