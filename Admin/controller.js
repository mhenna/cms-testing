module.exports = {

    ping: async (req, res) => {
        res.status(200).send({ status: 1 })
    },

    getUsers: async (req, res) => {
        const app = require('../app');
        let users = [];
        const snapshot = await app.db.collection('dev-users').get();
        snapshot.forEach((doc) => {
            let x = [];
            x = doc.data();
            x['id'] = doc.id;
            users.push(x)
        });
        res.status(200).send(users)
    },

    editUser: async (req, res) => {
        const app = require('../app');
        try {
            // console.log(req)
            console.log(req.body)
            await app.db.collection('users').doc(req.body.id).update(req.body.editFields);
            let snapshot = await app.db.collection('users').doc(req.body.id).get();
            let user = snapshot.data();
            user['id'] = req.body.id;
            res.status(200).send(user)
        } catch (err) {
            console.log(err)
            res.status(500).send({ 'error': 'Unexpected error occured ' + err })
        }
    },

    earlyBooking: async (req, res) => {
        const app = require('../app');
        const db = app.db;

        var eight = new Date();
        // eight.setDate(eight.getDate() + 1)
        eight.setHours(20);
        eight.setMinutes(0);
        eight.setMilliseconds(0);

        var twelve = new Date();
        // twelve.setDate(twelve.getDate() + 1)
        twelve.setHours(23);
        twelve.setMinutes(0);
        twelve.setMilliseconds(0);

        const startTime = eight;
        const endTime = twelve;
        // let earlySlots = [];
        let querySnapshot = await db.collection("dev-bookings").where('slotTime', '>=', startTime).get();
        // console.log(querySnapshot.docs)
        if (querySnapshot.empty) {
            for (var i = 0; i < (endTime - startTime); i++) {
                db.collection('dev-bookings').add({
                    booked: true,
                    userThatBookedUsername: "Devs",
                    slotPrice: 0,
                    slotTime: "",
                    locationAddress: "",
                    locationId: "",
                    locationName: ""
                })
            }
        } else {
            let earliest = endTime;
            querySnapshot.docs.forEach(doc => {
                if (doc.data()['slotTime'] < earliest)
                    earliest = doc.data()['slotTime'];
            })

            let x = earliest.toDate().getHours() - startTime.getHours()
            for (var i = 0; i < x; i++) {
                let date = new Date();
                date.setHours(endTime.getHours() - (i+1))
                await db.collection('dev-bookings').add({
                    booked: true,
                    userThatBookedUsername: "Devs",
                    slotPrice: 0,
                    slotTime: app.admin.firestore.Timestamp.fromDate(date),
                    locationAddress: "",
                    locationId: "",
                    locationName: "CLOUD SHAGHAL!!"

                })
            }
        }
        res.status(200).send("OK");

        // querySnapshot.docs.forEach(async (doc) => {
        //     earlySlots.push(doc);
        //     if (earlySlots.length != 0) {
        //         console.log('There is an early reservation');
        //     }
        //     else {


        //         db.collection("dev-bookings").add({
        //             booked: "true",
        //             userThatBookedUsername: "Devs",
        //         })
        //             .then(() => {
        //                 console.log("Document successfully written!");
        //             })
        //         console.log("The first resevation is after 12 AM");
        //     }
        // })
    },

    // sendNotificationsToUsers: async (req, res) => {
    //     const app = require('../app');

    //     // registration tokens to send to (retrieved from users collection, tokens key)
    //     let tokens = [
    //         'ePyQui0cmU1GqeyptpinVM:APA91bEOjEwqKPDScjQHCK-vEmzDh_-ZT8Ln_IbkRI12vF6FgpRxVtz68boAElfuxIA7tOZksPB6GJDxNsUKj9GwIhqaV4L9-uPr17HQoxZDqWdUlYsd4-FkQf1TiJANuVsC4cXX0rGw',
    //         'cd1nijiLkkbxtoQIzDsCwS:APA91bEz9JRUdVk4WY6HLOPXFpS0kQb4q2xmJep9dMWXRDZtT2eDpL6aL6AXrHDpthCIC_ew5kDBQ2KGM_KqaT1s1mgDUHEtXQ5M_q4pgmS0Sk4bS-zS-bpwHAsZDWAfo8D6qyzqrLfp',
    //         'cW5KhdajTfWFpYYiQmUTIx:APA91bGZtpDw4WZe8Ab0t0IcySc7FFakr7fnThw9QTQhvNdfgEfaIsZvhuiaQa2CMMLgQm2SrN03tOl4jjW8egWnKtyfM8dwq4NJrxVBad1sFzlFtk5PfcSfabdg8e-XOn2maC_9C6ia',
    //         'eAaz7xu620dRjuhwIxMTnA:APA91bEzuHwKMBntCuJNHDxwPNUsD4NHu5ueKUCOHRSs4oUiE22qKHNEAEApsnYfNaC_05odIuiLCSFXhDAlusAzElEiwTdn1yRrKeSPX49Q6jfMhaGkeujkNl_5-euNqJh5oowVHwCv',

    //     ]
    // let registrationToken = 'fT_-oGHL1UdYjPpV5kA8_0:APA91bH9HIsLeCq7S3oAwv2o0u4w9i93PjUR7vHDtW-3ozHq_Q5qOHfMJYEev6nOwSkNZYZbnafKzGeQJ0tp7cIb9oDFlgmcdFe_mo49I8KAfoJ3qS21ZZ1NkWYx6HX189-TLpcQPU5f';

    // // message to send
    // const message = {
    //     notification: {
    //         title: '$FooCorp up 1.43% on the day',
    //         body: '$FooCorp gained 11.80 points to close at 835.67, up 1.43% on the day.'
    //     },
    //     token: registrationToken
    // };

    // app.admin.messaging().send(message)
    //     .then((response) => {
    //         console.log(('Successfully sent message:', response))
    //     })
    //     .catch((error) => {
    //         console.log('Error sending message:', error)
    //     })

    //     // sending mechanism
    //     app.admin.messaging().sendMulticast(message)
    //         .then((response) => {
    //             // Response is a message ID string.
    //             console.log('Successfully sent message:', response);

    //         })
    //         .catch((error) => {
    //             console.log('Error sending message:', error);
    //         });
    // }
}