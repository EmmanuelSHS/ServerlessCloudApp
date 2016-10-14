            var liveaddress = jQuery.LiveAddress({
                key: "25739744617047893",
                debug: true,
                target: "US",
                addresses: [{
                    address1: '#street',
                    address2: '#apt',
                    locality: '#city',
                    administrative_area: '#state',
                    postal_code: '#ZIP',
                    country: '#country'
                }],
                waitForStreet: true
            });
            liveaddress.on("AddressAccepted", function(event, data, previousHandler) {
                if (data.response.chosen) {
                    alert(data.response.chosen);
                    jQuery('#delivery_point_barcode').val(data.response.chosen.delivery_point_barcode);
                }
                previousHandler(event, data);
            });
