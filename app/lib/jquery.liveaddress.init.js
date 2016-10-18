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
            console.log("live address inited");
            liveaddress.on("AddressAccepted", function(event, data, previousHandler) {
                console.log("address accepted");
                if (data.response.chosen) {
                    alert(data.response.chosen);
                    console.log(data.response.chosen.delivery_point_barcode);
                    jQuery('#delivery_point_barcode').val(data.response.chosen.delivery_point_barcode);
                    $('#delivery_point_barcode').trigger("input");
                }
                previousHandler(event, data);
            });
