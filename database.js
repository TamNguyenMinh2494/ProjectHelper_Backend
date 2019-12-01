const firebase = require("firebase-admin");
const Database = function (credentials, databaseURL) {
    this.app = firebase.initializeApp({ credential: firebase.credential.cert(credentials), databaseURL: databaseURL });
    this.db = this.app.firestore();
    this.auth = this.app.auth();

}

Database.prototype.updateRequirement = function (requirement) {
    this.db.collection("/requirements").doc(requirement.key).update(requirement);

}
Database.prototype.deleteRequirement = function (uid, docId) {
    return new Promise((resolve, reject) => {
        this.db.collection('/requirements').doc(docId).get().then((data) => {
            let chosenItem = data.data();
            if (chosenItem.ownerId == uid) {
                this.db.collection("/requirements").doc(docId).delete();
                resolve("Successfully");
            }
            resolve("Permission denied");
        });
    });
}

module.exports = Database;