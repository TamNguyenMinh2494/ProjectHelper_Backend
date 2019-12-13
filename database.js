const firebase = require("firebase-admin");
const Database = function (credentials, databaseURL) {
    this.app = firebase.initializeApp({ credential: firebase.credential.cert(credentials), databaseURL: databaseURL });
    this.db = this.app.firestore();
    this.auth = this.app.auth();
}
// Database.prototype.getAllRequirements = function () {
//     this.db.collection('/requirements').doc().snapshotChanges().pipe(
//         map(changes => changes.map(i => {
//             const data = i.payload.doc.data();
//             const key = i.payload.doc.id;
//             return { key, ...data };
//         }))
//     );
// }

Database.prototype.getAllRequirements = function () {

    this.db.collection('/requirements').get().then((snapshotChanges) => {
        snapshotChanges.docs.map((doc) => {
            return { id: doc.id, ...doc.data() }
        })
    })
}

Database.prototype.createRequirement = function (requirement) {
    //this.db.collection('/requirements').doc((Math.round(new Date().getTime() / 1000) + '-' + Math.floor((1000 + Math.random() * 9999)).toString()).toString()).set(requirement);
    this.db.collection('/requirements').doc((Math.round(new Date().getTime() / 1000) + '-' + Math.floor((1000 + Math.random() * 9999)).toString()).toString()).create(requirement);
}
// Database.prototype.updateRequirement = function (requirement) {
//     this.db.collection("/requirements").doc(requirement.key).update(requirement);
// }
Database.prototype.updateRequirement = function (uid, docId, requirement) {
    return new Promise((resolve, reject) => {
        this.db.collection("/requirements").doc(docId).get().then((data) => {
            let chosenItem = data.data();
            if (chosenItem.ownerId == uid) {
                this.db.collection("/requirements").doc(docId).update(requirement);
                resolve("Update Successfully");
            }
            resolve("Permission denied");
        })
    })
    this.db.collection("/requirements").doc(requirement.key).update(requirement);
}
Database.prototype.deleteRequirement = function (uid, docId) {
    return new Promise((resolve, reject) => {
        this.db.collection('/requirements').doc(docId).get().then((data) => {
            let chosenItem = data.data();
            if (chosenItem.ownerId == uid) {
                this.db.collection("/requirements").doc(docId).delete();
                resolve("Delete Successfully");
            }
            resolve("Permission denied");
        });
    });
}

module.exports = Database;