            var liveaddress = jQuery.LiveAddress({
                key: "25739744617047893",
                debug: true,
                target: "US",
                address: [{
                    address1: '#street',
                    locality: '#city',
                    administrative_area: '#state',
                    postal_code: '#ZIP',
                    country: '#country'
                }],
                waitForStreet: true
            });
