ko.bindingHandlers.numericValue = {
    init: function (element, valueAccessor, allBindingsAccessor) {
        var updateEvents = [];
        //keyup and change only works if precision is set to 0.
        if (allBindingsAccessor().valueUpdate === 'afterkeydown' && allBindingsAccessor().precision === 0) {
            updateEvents.push('keyup');
            updateEvents.push('change');
        } else {
            updateEvents.push('blur');
        }
        for (var x = 0; x < updateEvents.length; x++) {
            ko.utils.registerEventHandler(element, updateEvents[x], function () {
                var value = parseFloat(element.value) || 0;
                var precision = ko.utils.unwrapObservable(allBindingsAccessor().precision);
                if (typeof precision === "undefined") {
                    precision = ko.bindingHandlers.numericText.defaultPrecision;
                }
                var formattedValue = value.toFixed(precision);
                if ($.isFunction(valueAccessor())) {
                    var observable = valueAccessor();
                    observable(formattedValue);
                    ko.bindingHandlers.value.update(element, function () {
                        return formattedValue;
                    });
                }
            });
        }
    },
    update: function (element, valueAccessor, allBindingsAccessor) {
        var value = ko.utils.unwrapObservable(valueAccessor());
        var formattedValue = 0;
        if (typeof value === 'number') {
            var precision = ko.utils.unwrapObservable(allBindingsAccessor().precision);
            if (typeof precision === "undefined") {
                precision = ko.bindingHandlers.numericText.defaultPrecision;
            }
            formattedValue = value.toFixed(precision);
        }

        ko.bindingHandlers.value.update(element, function () { return formattedValue; });
    },
    defaultPrecision: 2
};