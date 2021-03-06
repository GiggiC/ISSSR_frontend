'use strict';
/**
 * @ngdoc function
 * @name sbAdminApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the sbAdminApp
 */
mainAngularModule
    .controller('ProductSoftwareCreateCtrl', ['$scope', '$state',
        'softwareProductDataFactory', 'ErrorStateRedirector', 'StateMachineDataFactory',
        function ($scope, $state,
                  softwareProductDataFactory, ErrorStateRedirector,
                  StateMachineDataFactory) {

            var ctrl = this;
            resetFieldsFn();
            ctrl.resetFields = resetFieldsFn;
            ctrl.insertProduct = insertProductFn;



            softwareProductDataFactory.metadata(function (response) {
                ctrl.targetTypes = response.data.targetTypes;
                console.log("types", ctrl.targetTypes)
            }, function () {
                alert("Invalid metadata");
            });

            StateMachineDataFactory.getStateMachines(function (response) {
                ctrl.stateMachines = response.data;
                console.log("stateMachines", ctrl.stateMachines)
            }, function () {
                alert("Error: getStateMachines")
            });

            function resetFieldsFn() {
                ctrl.currentSoftwareProduct = {};
            }

            function insertProductFn() {

                let tags = ctrl.currentSoftwareProduct.categories;
                ctrl.currentSoftwareProduct.categories = [];
                ctrl.currentSoftwareProduct.targetState = "ACTIVE";
                
                if (tags != null) {
                    for (let i = 0; i < tags.length; i++) {
                        ctrl.currentSoftwareProduct.categories[i] = tags[i].text;
                    }
                }

                softwareProductDataFactory.Insert(
                    ctrl.currentSoftwareProduct,
                    function (response) {
                        console.log(response);
                        $state.go('productsoftware.list', {}, {reload: true});
                    }, function (error) {
                        let msgErr = "Errore nell'inserimento del prodotto";
                        if(error.data === "expiration"){
                            msgErr = "Login session expired"
                        }
                        ErrorStateRedirector.GoToErrorPage({Messaggio: msgErr});
                    });

                resetFieldsFn();

            }

        }

    ]);