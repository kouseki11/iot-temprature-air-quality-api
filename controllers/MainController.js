const admin = require('firebase-admin');
const moment = require('moment');

// Initialize Firebase Firestore
const db = admin.firestore();

const readData = async (req, res) => {
  try {
    const mainRef = db.collection('main');

    const querySnapshot = await mainRef.get();

    if (querySnapshot.empty) {
      return res.status(404).json({ message: 'No data found' });
    }

    const data = {
      main: {},
    };

    querySnapshot.forEach((doc) => {
      const tanggal = doc.data().tanggal;

      if (!data.main[tanggal]) {
        data.main[tanggal] = [];
      }

      data.main[tanggal].push({
        id: doc.id,
        suhu: doc.data().suhu,
        udara: doc.data().udara,
        jam: doc.data().jam,
        tanggal: doc.data().tanggal,
        dateTime: doc.data().dateTime
      });
    });

    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


const readOneLastData = async (req, res) => {
  try {
    const mainRef = db.collection('main');

    const querySnapshot = await mainRef.orderBy('dateTime', 'desc').limit(1).get();

    if (querySnapshot.empty) {
      return res.status(404).json({ message: 'No data found' });
    }

    const lastDocument = querySnapshot.docs[0];
    const data = {
      main : { 
      id: lastDocument.id,
      suhu: lastDocument.data().suhu,
      udara: lastDocument.data().udara,
      jam: lastDocument.data().jam,
      tanggal: lastDocument.data().tanggal,
      dateTime: lastDocument.data().dateTime
      }
    };

    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};



const createData = async (req, res) => {
  try {
    const { suhu, udara } = req.body;

    const currentTime = new Date()
    const formattedTime = moment().format('hh:mm A');
    const formattedDate = moment().format('DD-MM-YYYY');

    const mainRef = db.collection('main');

    const mainDocRef = await mainRef.add({ suhu: suhu, udara: udara, jam: formattedTime, tanggal: formattedDate, dateTime: currentTime });

    const responseData = {
      main: { id: mainDocRef.id, suhu: suhu, udara: udara, jam: formattedTime, tanggal: formattedDate, dateTime: currentTime },
    };

    res.status(201).json({
      message: 'Data added successfully',
      data: responseData,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};




module.exports = { readData, createData, readOneLastData };







// Using Database Realtime

// // controllers/combinedController.js
// const admin = require('firebase-admin');

// // Initialize Firebase Realtime Database
// const db = admin.database();

// const readData = async (req, res) => {
//   try {
//     const suhuRef = db.ref('suhu');
//     const udaraRef = db.ref('udara');
//     const tanggalRef = db.ref('tanggal');

//     const [suhuSnapshot, udaraSnapshot, tanggalSnapshot] = await Promise.all([
//       suhuRef.once('value'),
//       udaraRef.once('value'),
//       tanggalRef.once('value'),
//     ]);

//     const data = {
//       suhu: suhuSnapshot.val(),
//       udara: udaraSnapshot.val(),
//       tanggal: tanggalSnapshot.val(),
//     };

//     res.json(data);
//   } catch (error) {
//     res.status(500).json({ error: error.message });
//   }
// };

// const createData = async (req, res) => {
//   try {
//     const { suhu, udara } = req.body;

//     // Get the current date and time
//     const currentTime = new Date().toISOString();

//     const suhuRef = db.ref('suhu');
//     const udaraRef = db.ref('udara');
//     const tanggalRef = db.ref('tanggal');

//     await Promise.all([
//       suhuRef.push({ value: suhu }),
//       udaraRef.push({ value: udara }),
//       tanggalRef.push({ timestamp: currentTime }),
//     ]);

//     res.status(201).send('Data added successfully');
//   } catch (error) {
//     res.status(500).json({ error: error.message });
//   }
// };


// module.exports = { readData, createData };
