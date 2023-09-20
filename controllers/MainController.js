const admin = require('firebase-admin');
const moment = require('moment');
const getWeekNumber = require('../utils/getWeekNumber')

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
        valueSuhu: doc.data().valueSuhu,
        udara: doc.data().udara,
        valueUdara: doc.data().valueUdara, 
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



const readDataAirPerDay = async (req, res) => {
  try {
    const tanggal = req.query.date; 
    const mainRef = db.collection('main');
    
    // Query the Firestore collection for documents matching the specified "tanggal"
    const querySnapshot = await mainRef.where('tanggal', '==', tanggal).get();

    if (querySnapshot.empty) {
      return res.status(404).json({ message: 'No data found for the specified date' });
    }

    const data = {
      main: {},
    };

    querySnapshot.forEach((doc) => {
      const jam = doc.data().jam;


      if (!data.main[jam]) {
        data.main[jam] = {
          udara: doc.data().udara,
          valueUdara: doc.data().valueUdara,
          jam: doc.data().jam,
          tanggal: doc.data().tanggal,
          dateTime: doc.data().dateTime,
        };
      }
    });

    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const readDataTempraturePerDay = async (req, res) => {
  try {
    const tanggal = req.query.date; 
    const mainRef = db.collection('main');
    
    // Query the Firestore collection for documents matching the specified "tanggal"
    const querySnapshot = await mainRef.where('tanggal', '==', tanggal).get();

    if (querySnapshot.empty) {
      return res.status(404).json({ message: 'No data found for the specified date' });
    }

    const data = {
      main: {},
    };

    querySnapshot.forEach((doc) => {
      const jam = doc.data().jam;


      if (!data.main[jam]) {
        data.main[jam] = {
          suhu: doc.data().suhu,
          valueSuhu: doc.data().valueSuhu,
          jam: doc.data().jam,
          tanggal: doc.data().tanggal,
          dateTime: doc.data().dateTime,
        };
      }
    });

    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};



const readDataAirPerWeek = async (req, res) => {
  try {
    const startDate = req.query.startDate;
    const endDate = req.query.endDate;

    const mainRef = db.collection('main');

    const querySnapshot = await mainRef
      .where('tanggal', '>=', startDate)
      .where('tanggal', '<=', endDate)
      .get();

    if (querySnapshot.empty) {
      return res.status(404).json({ message: 'No data found' });
    }

    const data = {
      main: {},
    };

    querySnapshot.forEach((doc) => {
      const tanggal = doc.data().tanggal;
      const udara = Math.round(doc.data().udara);

      if (!data.main[tanggal]) {
        data.main[tanggal] = {
          udara: [],
          valueUdara: "",
        };
      }

      data.main[tanggal].udara.push(udara);

      // Menghitung valueUdara berdasarkan udara
      if (udara <= 50) {
        data.main[tanggal].valueUdara = "Very Good";
      } else if (udara <= 100) {
        data.main[tanggal].valueUdara = "Good";
      } else if (udara <= 150) {
        data.main[tanggal].valueUdara = "Medium";
      } else if (udara <= 200) {
        data.main[tanggal].valueUdara = "Bad";
      } else if (udara <= 300) {
        data.main[tanggal].valueUdara = "Very Bad";
      } else {
        data.main[tanggal].valueUdara = "Very Very Bad";
      }
    });

    // Menghitung rata-rata suhu dan udara per hari
    Object.keys(data.main).forEach((tanggal) => {
      const udara = data.main[tanggal].udara;

      const rataRataUdara = udara.reduce((acc, val) => acc + val, 0) / udara.length;

      data.main[tanggal].rataRataUdara = Math.round(rataRataUdara);

      // Menghapus array suhu dan udara asli jika tidak diperlukan
      delete data.main[tanggal].udara;
    });

    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const readDataTempraturePerWeek = async (req, res) => {
  try {
    const startDate = req.query.startDate;
    const endDate = req.query.endDate;

    const mainRef = db.collection('main');

    const querySnapshot = await mainRef
      .where('tanggal', '>=', startDate)
      .where('tanggal', '<=', endDate)
      .get();

    if (querySnapshot.empty) {
      return res.status(404).json({ message: 'No data found' });
    }

    const data = {
      main: {},
    };

    querySnapshot.forEach((doc) => {
      const tanggal = doc.data().tanggal;
      const suhu = Math.round(doc.data().suhu);

      if (!data.main[tanggal]) {
        data.main[tanggal] = {
          suhu: [],
          valueSuhu: "",
        };
      }

      data.main[tanggal].suhu.push(suhu);

      // Menghitung valueSuhu berdasarkan suhu
      if (suhu <= 0) {
        data.main[tanggal].valueSuhu = "Extreme Cold";
      } else if (suhu <= 10) {
        data.main[tanggal].valueSuhu = "Cold";
      } else if (suhu <= 20) {
        data.main[tanggal].valueSuhu = "Cool";
      } else if (suhu <= 30) {
        data.main[tanggal].valueSuhu = "Warm";
      } else if (suhu <= 40) {
        data.main[tanggal].valueSuhu = "Hot";
      } else {
        data.main[tanggal].valueSuhu = "Extreme Hot";
      }
    });

    // Menghitung rata-rata suhu dan udara per hari
    Object.keys(data.main).forEach((tanggal) => {
      const suhu = data.main[tanggal].suhu;

      const rataRataSuhu = suhu.reduce((acc, val) => acc + val, 0) / suhu.length;

      data.main[tanggal].rataRataSuhu = Math.round(rataRataSuhu);

      // Menghapus array suhu dan udara asli jika tidak diperlukan
      delete data.main[tanggal].suhu;
    });

    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


const readDataAirPerMonth = async (req, res) => {
  try {
    const startDate = req.query.startDate;
    const endDate = req.query.endDate;

    const mainRef = db.collection('main');

    const querySnapshot = await mainRef
      .where('tanggal', '>=', startDate)
      .where('tanggal', '<=', endDate)
      .get();

    if (querySnapshot.empty) {
      return res.status(404).json({ message: 'No data found' });
    }

    const data = {
      main: {},
    };

    querySnapshot.forEach((doc) => {
      const tanggal = doc.data().tanggal;
      const udara = Math.round(doc.data().udara);

      // Extract year, month, and week from the date
      const dateParts = tanggal.split('-');
      const year = dateParts[0];
      const month = dateParts[1];
      const day = dateParts[2];
      const week = getWeekNumber(new Date(year, month - 1, day));

      // Create a key for the week in the format "Minggu {week}"
      const weekKey = `Minggu ${week}`;

      // Create a key for the month in the format "Bulan {month}"
      const monthKey = `Bulan ${month}`;

      // Initialize the data structure if it doesn't exist
      if (!data.main[monthKey]) {
        data.main[monthKey] = {};
      }

      // Initialize the data structure for the week if it doesn't exist
      if (!data.main[monthKey][weekKey]) {
        data.main[monthKey][weekKey] = {
          udara: [],
          valueUdara: "",
        };
      }

      // Add data to the corresponding week
      data.main[monthKey][weekKey].udara.push(udara);

      // Calculate valueUdara based on udara
      if (udara <= 50) {
        data.main[monthKey][weekKey].valueUdara = "Very Good";
      } else if (udara <= 100) {
        data.main[monthKey][weekKey].valueUdara = "Good";
      } else if (udara <= 150) {
        data.main[monthKey][weekKey].valueUdara = "Medium";
      } else if (udara <= 200) {
        data.main[monthKey][weekKey].valueUdara = "Bad";
      } else if (udara <= 300) {
        data.main[monthKey][weekKey].valueUdara = "Very Bad";
      } else {
        data.main[monthKey][weekKey].valueUdara = "Very Very Bad";
      }

    });

    // Calculate the overall averages per month and week
    Object.keys(data.main).forEach((monthKey) => {
      Object.keys(data.main[monthKey]).forEach((weekKey) => {
        const udara = data.main[monthKey][weekKey].udara;

        const rataRataUdara = udara.reduce((acc, val) => acc + val, 0) / udara.length;

        data.main[monthKey][weekKey].udara = Math.round(rataRataUdara);
      });
    });

    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const readDataTempraturePerMonth = async (req, res) => {
  try {
    const startDate = req.query.startDate;
    const endDate = req.query.endDate;

    const mainRef = db.collection('main');

    const querySnapshot = await mainRef
      .where('tanggal', '>=', startDate)
      .where('tanggal', '<=', endDate)
      .get();

    if (querySnapshot.empty) {
      return res.status(404).json({ message: 'No data found' });
    }

    const data = {
      main: {},
    };

    querySnapshot.forEach((doc) => {
      const tanggal = doc.data().tanggal;
      const suhu = Math.round(doc.data().suhu);

      // Extract year, month, and week from the date
      const dateParts = tanggal.split('-');
      const year = dateParts[0];
      const month = dateParts[1];
      const day = dateParts[2];
      const week = getWeekNumber(new Date(year, month - 1, day));

      // Create a key for the week in the format "Minggu {week}"
      const weekKey = `Minggu ${week}`;

      // Create a key for the month in the format "Bulan {month}"
      const monthKey = `Bulan ${month}`;

      // Initialize the data structure if it doesn't exist
      if (!data.main[monthKey]) {
        data.main[monthKey] = {};
      }

      // Initialize the data structure for the week if it doesn't exist
      if (!data.main[monthKey][weekKey]) {
        data.main[monthKey][weekKey] = {
          suhu: [],
          valueSuhu: "",
        };
      }

      // Add data to the corresponding week
      data.main[monthKey][weekKey].suhu.push(suhu);

      // Calculate valueSuhu based on suhu
      if (suhu <= 0) {
        data.main[monthKey][weekKey].valueSuhu = "Extreme Cold";
      } else if (suhu <= 10) {
        data.main[monthKey][weekKey].valueSuhu = "Cold";
      } else if (suhu <= 20) {
        data.main[monthKey][weekKey].valueSuhu = "Cool";
      } else if (suhu <= 30) {
        data.main[monthKey][weekKey].valueSuhu = "Warm";
      } else if (suhu <= 40) {
        data.main[monthKey][weekKey].valueSuhu = "Hot";
      } else {
        data.main[monthKey][weekKey].valueSuhu = "Extreme Hot";
      }
    });

    // Calculate the overall averages per month and week
    Object.keys(data.main).forEach((monthKey) => {
      Object.keys(data.main[monthKey]).forEach((weekKey) => {
        const suhu = data.main[monthKey][weekKey].suhu;

        const rataRataSuhu = suhu.reduce((acc, val) => acc + val, 0) / suhu.length;

        data.main[monthKey][weekKey].suhu = Math.round(rataRataSuhu);
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
      main: {
        id: lastDocument.id,
        suhu: lastDocument.data().suhu,
        valueSuhu: lastDocument.data().valueSuhu,
        udara: lastDocument.data().udara, 
        valueUdara: lastDocument.data().valueUdara,
        jam: lastDocument.data().jam,
        tanggal: lastDocument.data().tanggal,
        dateTime: lastDocument.data().dateTime,
      },
    };

    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};




const createData = async (req, res) => {
  try {
    const { suhu, udara } = req.body;

    const currentTime = new Date();
    const formattedTime = moment().format('hh:mm A');
    const formattedDate = moment().format('DD-MM-YYYY');

    const hours = currentTime.getHours();
    const minutes = currentTime.getMinutes();
    const formattedMinutes = minutes < 10 ? `0${minutes}` : minutes; // Ensure two-digit format for minutes
    const formattedHours = hours < 10 ? `0${hours}` : hours; // Ensure two-digit format for minutes
    const formattedHour = parseFloat(`${formattedHours}.${formattedMinutes}`); // 

    let valueUdara = ""; 

    if (udara <= 50) {
      valueUdara = "Very Good"
    } else if ( udara <= 100 ) {
      valueUdara = "Good"
    } else if ( udara <= 150 ) {
      valueUdara = "Medium"
    } else if ( udara <= 200 ) {
      valueUdara = "Bad"
    } else if ( udara <= 300 ) {
      valueUdara = "Very Bad"
    } else {
      valueUdara = "Very Very Bad"
    }

    let valueSuhu = ""; 

    if (suhu <= 0) {
      valueSuhu = "Extreme Cold"
    } else if ( suhu <= 10 ) {
      valueSuhu = "Cold"
    } else if ( suhu <= 20 ) {
      valueSuhu = "Cool"
    } else if ( suhu <= 30 ) {
      valueSuhu = "Warm"
    } else if ( suhu <= 40 ) {
      valueSuhu = "Hot"
    } else {
      valueSuhu = "Extreme Hot"
    }

    const mainRef = db.collection('main'); 

    const mainDocRef = await mainRef.add({
      suhu: suhu,
      valueSuhu: valueSuhu,
      udara: udara,
      valueUdara: valueUdara,
      jam: formattedTime,
      tanggal: formattedDate,
      dateTime: currentTime,
    });

    const responseData = {
      main: {
        id: mainDocRef.id,
        suhu: suhu,
        valueSuhu: valueSuhu,
        udara: udara,
        valueUdara: valueUdara,
        jam: formattedHour,
        tanggal: formattedDate,
        dateTime: currentTime,
      },
    };

    res.status(201).json({
      message: 'Data added successfully',
      data: responseData,
    });
  } catch (error) {
    console.error(error); 
    res.status(500).json({ error: 'An error occurred while processing your request' });
  }
};



module.exports = { readData, createData, readOneLastData, readDataAirPerDay, readDataAirPerWeek, readDataAirPerMonth, readDataTempraturePerDay, readDataTempraturePerWeek, readDataTempraturePerMonth };







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
