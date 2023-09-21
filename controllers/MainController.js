const admin = require("firebase-admin");
const moment = require("moment-timezone");
const getWeekNumber = require("../utils/getWeekNumber");

// Initialize Firebase Firestore
const db = admin.firestore();

moment.tz.setDefault('Asia/Jakarta');

const readData = async (req, res) => {
  try {
    const tanggal = req.query.date;
    const mainRef = db.collection("main");

    const querySnapshot = await mainRef.where("tanggal", "==", tanggal).get();

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
        dateTime: doc.data().dateTime,
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
    const mainRef = db.collection("main");

    // Query the Firestore collection for documents matching the specified "tanggal"
    const querySnapshot = await mainRef.where("tanggal", "==", tanggal).get();

    if (querySnapshot.empty) {
      return res
        .status(404)
        .json({ message: "No data found for the specified date" });
    }

    let data = [];

    querySnapshot.forEach((doc) => {
      const item = {
        id: doc.id,
        udara: doc.data().udara,
        valueUdara: doc.data().valueUdara,
        jam: doc.data().jam,
        tanggal: doc.data().tanggal,
        dateTime: doc.data().dateTime,
      };
      data.push(item); // Menyimpan data dalam array
    });

    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const readAverageDataAirPerDay = async (req, res) => {
  try {
    const tanggal = req.query.date;
    const mainRef = db.collection("main");

    // Query the Firestore collection for documents matching the specified "tanggal"
    const querySnapshot = await mainRef.where("tanggal", "==", tanggal).get();

    if (querySnapshot.empty) {
      return res
        .status(404)
        .json({ message: "No data found for the specified date" });
    }

    let totalUdara = 0; // Initialize total udara
    let dataCount = 0; // Initialize data count

    querySnapshot.forEach((doc) => {
      const item = {
        udara: doc.data().udara,
        valueUdara: doc.data().valueUdara,
      };
      totalUdara += doc.data().udara; // Add udara value to the total
      dataCount++; // Increment data count
    });

    const averageUdara = totalUdara / dataCount; // Calculate average udara
    const averageUdaraB = Math.round(averageUdara);

    let valueAverageUdara = ""; // Declare valueAverageUdara as a variable

    if (averageUdaraB <= 50) {
      valueAverageUdara = "Very Good";
    } else if (averageUdaraB <= 100) {
      valueAverageUdara = "Good";
    } else if (averageUdaraB <= 150) {
      valueAverageUdara = "Medium";
    } else if (averageUdaraB <= 200) {
      valueAverageUdara = "Bad";
    } else if (averageUdaraB <= 300) {
      valueAverageUdara = "Very Bad";
    } else {
      valueAverageUdara = "Very Very Bad";
    }

    res.json({
      averageUdara: averageUdaraB,
      valueAverageUdara: valueAverageUdara, // Include valueAverageUdara in the response
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const readAverageDataAirPerWeek = async (req, res) => {
  try {
    const startDate = req.query.startDate;
    const endDate = req.query.endDate;
    const mainRef = db.collection("main");

    // Query the Firestore collection for documents matching the specified "tanggal"
    const querySnapshot = await mainRef
    .where("tanggal", ">=", startDate)
    .where("tanggal", "<=", endDate)
    .get();

    if (querySnapshot.empty) {
      return res
        .status(404)
        .json({ message: "No data found for the specified date" });
    }

    let totalUdara = 0; // Initialize total udara
    let dataCount = 0; // Initialize data count

    querySnapshot.forEach((doc) => {
      const item = {
        udara: doc.data().udara,
        valueUdara: doc.data().valueUdara,
      };
      totalUdara += doc.data().udara; // Add udara value to the total
      dataCount++; // Increment data count
    });

    const averageUdara = totalUdara / dataCount; // Calculate average udara
    const averageUdaraB = Math.round(averageUdara);

    let valueAverageUdara = ""; // Declare valueAverageUdara as a variable

    if (averageUdaraB <= 50) {
      valueAverageUdara = "Very Good";
    } else if (averageUdaraB <= 100) {
      valueAverageUdara = "Good";
    } else if (averageUdaraB <= 150) {
      valueAverageUdara = "Medium";
    } else if (averageUdaraB <= 200) {
      valueAverageUdara = "Bad";
    } else if (averageUdaraB <= 300) {
      valueAverageUdara = "Very Bad";
    } else {
      valueAverageUdara = "Very Very Bad";
    }

    res.json({
      averageUdara: averageUdaraB,
      valueAverageUdara: valueAverageUdara, // Include valueAverageUdara in the response
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const readAverageDataAirPerMonth = async (req, res) => {
  try {
    const startDate = req.query.startDate;
    const endDate = req.query.endDate;
    const mainRef = db.collection("main");

    // Query the Firestore collection for documents matching the specified "tanggal"
    const querySnapshot = await mainRef
      .where("tanggal", ">=", startDate)
      .where("tanggal", "<=", endDate)
      .get();

    if (querySnapshot.empty) {
      return res
        .status(404)
        .json({ message: "No data found for the specified date" });
    }

    let totalUdara = 0; // Initialize total udara
    let dataCount = 0; // Initialize data count

    querySnapshot.forEach((doc) => {
      const item = {
        udara: doc.data().udara,
        valueUdara: doc.data().valueUdara,
      };
      totalUdara += doc.data().udara; // Add udara value to the total
      dataCount++; // Increment data count
    });

    const averageUdara = totalUdara / dataCount; // Calculate average udara
    const averageUdaraB = Math.round(averageUdara);

    let valueAverageUdara = ""; // Declare valueAverageUdara as a variable

    if (averageUdaraB <= 50) {
      valueAverageUdara = "Very Good";
    } else if (averageUdaraB <= 100) {
      valueAverageUdara = "Good";
    } else if (averageUdaraB <= 150) {
      valueAverageUdara = "Medium";
    } else if (averageUdaraB <= 200) {
      valueAverageUdara = "Bad";
    } else if (averageUdaraB <= 300) {
      valueAverageUdara = "Very Bad";
    } else {
      valueAverageUdara = "Very Very Bad";
    }

    res.json({
      averageUdara: averageUdaraB,
      valueAverageUdara: valueAverageUdara, // Include valueAverageUdara in the response
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


const readDataTempraturePerDay = async (req, res) => {
  try {
    const tanggal = req.query.date;
    const mainRef = db.collection("main");

    // Query the Firestore collection for documents matching the specified "tanggal"
    const querySnapshot = await mainRef.where("tanggal", "==", tanggal).get();

    if (querySnapshot.empty) {
      return res
        .status(404)
        .json({ message: "No data found for the specified date" });
    }

    const data = [];

    querySnapshot.forEach((doc) => {
      const item = {
        suhu: doc.data().suhu,
        valueSuhu: doc.data().valueSuhu,
        jam: doc.data().jam,
        tanggal: doc.data().tanggal,
        dateTime: doc.data().dateTime,
      };
      data.push(item);
    });

    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const readAverageDataTempraturePerDay = async (req, res) => {
  try {
    const tanggal = req.query.date;
    const mainRef = db.collection("main");

    // Query the Firestore collection for documents matching the specified "tanggal"
    const querySnapshot = await mainRef.where("tanggal", "==", tanggal).get();

    if (querySnapshot.empty) {
      return res
        .status(404)
        .json({ message: "No data found for the specified date" });
    }

    let totalSuhu = 0; // Initialize total Suhu
    let dataCount = 0; // Initialize data count

    querySnapshot.forEach((doc) => {
      const item = {
        suhu: doc.data().suhu,
        valueSuhu: doc.data().valueSuhu,
      };
      totalSuhu += doc.data().suhu; // Add Suhu value to the total
      dataCount++; // Increment data count
    });

    const averageSuhu = totalSuhu / dataCount; // Calculate average Suhu
    const averageSuhuB = Math.round(averageSuhu);

    let valueAverageSuhu = ""; // Declare valueAverageSuhu as a variable

    if (averageSuhuB <= 0) {
      valueAverageSuhu = "Extreme Cold";
    } else if (averageSuhuB <= 10) {
      valueAverageSuhu = "Cold";
    } else if (averageSuhuB <= 20) {
      valueAverageSuhu = "Cool";
    } else if (averageSuhuB <= 30) {
      valueAverageSuhu = "Warm";
    } else if (averageSuhuB <= 40) {
      valueAverageSuhu = "Hot";
    } else {
      valueAverageSuhu = "Extreme Hot";
    }

    res.json({
      averageSuhu: averageSuhuB,
      valueAverageSuhu: valueAverageSuhu, // Include valueAverageSuhu in the response
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const readAverageDataTempraturePerWeek = async (req, res) => {
  try {
    const startDate = req.query.startDate;
    const endDate = req.query.endDate;
    const mainRef = db.collection("main");

    // Query the Firestore collection for documents matching the specified "tanggal"
    const querySnapshot = await mainRef
    .where("tanggal", ">=", startDate)
    .where("tanggal", "<=", endDate)
    .get();

    if (querySnapshot.empty) {
      return res
        .status(404)
        .json({ message: "No data found for the specified date" });
    }

    let totalSuhu = 0; // Initialize total Suhu
    let dataCount = 0; // Initialize data count

    querySnapshot.forEach((doc) => {
      const item = {
        suhu: doc.data().suhu,
        valueSuhu: doc.data().valueSuhu,
      };
      totalSuhu += doc.data().suhu; // Add Suhu value to the total
      dataCount++; // Increment data count
    });

    const averageSuhu = totalSuhu / dataCount; // Calculate average Suhu
    const averageSuhuB = Math.round(averageSuhu);

    let valueAverageSuhu = ""; // Declare valueAverageSuhu as a variable

    if (averageSuhuB <= 0) {
      valueAverageSuhu = "Extreme Cold";
    } else if (averageSuhuB <= 10) {
      valueAverageSuhu = "Cold";
    } else if (averageSuhuB <= 20) {
      valueAverageSuhu = "Cool";
    } else if (averageSuhuB <= 30) {
      valueAverageSuhu = "Warm";
    } else if (averageSuhuB <= 40) {
      valueAverageSuhu = "Hot";
    } else {
      valueAverageSuhu = "Extreme Hot";
    }

    res.json({
      averageSuhu: averageSuhuB,
      valueAverageSuhu: valueAverageSuhu, // Include valueAverageSuhu in the response
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const readAverageDataTempraturePerMonth = async (req, res) => {
  try {
    const startDate = req.query.startDate;
    const endDate = req.query.endDate;
    const mainRef = db.collection("main");

    // Query the Firestore collection for documents matching the specified "tanggal"
    const querySnapshot = await mainRef
    .where("tanggal", ">=", startDate)
    .where("tanggal", "<=", endDate)
    .get();

    if (querySnapshot.empty) {
      return res
        .status(404)
        .json({ message: "No data found for the specified date" });
    }

    let totalSuhu = 0; // Initialize total Suhu
    let dataCount = 0; // Initialize data count

    querySnapshot.forEach((doc) => {
      const item = {
        suhu: doc.data().suhu,
        valueSuhu: doc.data().valueSuhu,
      };
      totalSuhu += doc.data().suhu; // Add Suhu value to the total
      dataCount++; // Increment data count
    });

    const averageSuhu = totalSuhu / dataCount; // Calculate average Suhu
    const averageSuhuB = Math.round(averageSuhu);

    let valueAverageSuhu = ""; // Declare valueAverageSuhu as a variable

    if (averageSuhuB <= 0) {
      valueAverageSuhu = "Extreme Cold";
    } else if (averageSuhuB <= 10) {
      valueAverageSuhu = "Cold";
    } else if (averageSuhuB <= 20) {
      valueAverageSuhu = "Cool";
    } else if (averageSuhuB <= 30) {
      valueAverageSuhu = "Warm";
    } else if (averageSuhuB <= 40) {
      valueAverageSuhu = "Hot";
    } else {
      valueAverageSuhu = "Extreme Hot";
    }

    res.json({
      averageSuhu: averageSuhuB,
      valueAverageSuhu: valueAverageSuhu, // Include valueAverageSuhu in the response
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const readDataAirPerWeek = async (req, res) => {
  try {
    const startDate = req.query.startDate;
    const endDate = req.query.endDate;

    const mainRef = db.collection("main");

    const querySnapshot = await mainRef
      .where("tanggal", ">=", startDate)
      .where("tanggal", "<=", endDate)
      .get();

    if (querySnapshot.empty) {
      return res.status(404).json({ message: "No data found" });
    }

    const data = {};

    querySnapshot.forEach((doc) => {
      const tanggal = doc.data().tanggal;
      const udara = Math.round(doc.data().udara);

      if (!data[tanggal]) {
        data[tanggal] = {
          valueUdara: "",
          rataRataUdara: 0,
        };
      }

      // Menghitung valueUdara berdasarkan udara
      if (udara <= 50) {
        data[tanggal].valueUdara = "Very Good";
      } else if (udara <= 100) {
        data[tanggal].valueUdara = "Good";
      } else if (udara <= 150) {
        data[tanggal].valueUdara = "Medium";
      } else if (udara <= 200) {
        data[tanggal].valueUdara = "Bad";
      } else if (udara <= 300) {
        data[tanggal].valueUdara = "Very Bad";
      } else {
        data[tanggal].valueUdara = "Very Very Bad";
      }

      // Add udara value to an array if needed
      if (!data[tanggal].udara) {
        data[tanggal].udara = [];
      }
      data[tanggal].udara.push(udara);
    });

    // Menghitung rata-rata suhu dan udara per hari
    Object.keys(data).forEach((tanggal) => {
      const udara = data[tanggal].udara;
      const rataRataUdara =
        udara.reduce((acc, val) => acc + val, 0) / udara.length;
      data[tanggal].rataRataUdara = Math.round(rataRataUdara);

      // Remove the udara array if it's no longer needed
      delete data[tanggal].udara;
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

    const mainRef = db.collection("main");

    const querySnapshot = await mainRef
      .where("tanggal", ">=", startDate)
      .where("tanggal", "<=", endDate)
      .get();

    if (querySnapshot.empty) {
      return res.status(404).json({ message: "No data found" });
    }

    const data = {};

    querySnapshot.forEach((doc) => {
      const tanggal = doc.data().tanggal;
      const suhu = Math.round(doc.data().suhu);

      if (!data[tanggal]) {
        data[tanggal] = {
          suhu: [],
          valueSuhu: "",
        };
      }

      data[tanggal].suhu.push(suhu);

      // Menghitung valueSuhu berdasarkan suhu
      if (suhu <= 0) {
        data[tanggal].valueSuhu = "Extreme Cold";
      } else if (suhu <= 10) {
        data[tanggal].valueSuhu = "Cold";
      } else if (suhu <= 20) {
        data[tanggal].valueSuhu = "Cool";
      } else if (suhu <= 30) {
        data[tanggal].valueSuhu = "Warm";
      } else if (suhu <= 40) {
        data[tanggal].valueSuhu = "Hot";
      } else {
        data[tanggal].valueSuhu = "Extreme Hot";
      }
    });

    // Menghitung rata-rata suhu dan udara per hari
    Object.keys(data).forEach((tanggal) => {
      const suhu = data[tanggal].suhu;

      const rataRataSuhu =
        suhu.reduce((acc, val) => acc + val, 0) / suhu.length;

      data[tanggal].rataRataSuhu = Math.round(rataRataSuhu);

      // Menghapus array suhu dan udara asli jika tidak diperlukan
      delete data[tanggal].suhu;
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
      const week = getWeekNumber(moment(new Date(year, month - 1, day)));

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
      const week = getWeekNumber(moment(new Date(year, month - 1, day)));

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
    const mainRef = db.collection("main");

    const querySnapshot = await mainRef
      .orderBy("dateTime", "desc")
      .limit(1)
      .get();

    if (querySnapshot.empty) {
      return res.status(404).json({ message: "No data found" });
    }

    const lastDocument = querySnapshot.docs[0];
    const data = {
      id: lastDocument.id,
      suhu: lastDocument.data().suhu,
      valueSuhu: lastDocument.data().valueSuhu,
      udara: lastDocument.data().udara,
      valueUdara: lastDocument.data().valueUdara,
      jam: lastDocument.data().jam,
      tanggal: lastDocument.data().tanggal,
      dateTime: lastDocument.data().dateTime,
    };

    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const createData = async (req, res) => {
  try {
    const { suhu, udara } = req.body;

    const currentTime = moment(new Date())
    const formattedTime = moment().format("HH.mm");
    const formattedDate = moment().format("DD-MM-YYYY");

    let valueUdara = "";

    if (udara <= 50) {
      valueUdara = "Very Good";
    } else if (udara <= 100) {
      valueUdara = "Good";
    } else if (udara <= 150) {
      valueUdara = "Medium";
    } else if (udara <= 200) {
      valueUdara = "Bad";
    } else if (udara <= 300) {
      valueUdara = "Very Bad";
    } else {
      valueUdara = "Very Very Bad";
    }

    let valueSuhu = "";

    if (suhu <= 0) {
      valueSuhu = "Extreme Cold";
    } else if (suhu <= 10) {
      valueSuhu = "Cold";
    } else if (suhu <= 20) {
      valueSuhu = "Cool";
    } else if (suhu <= 30) {
      valueSuhu = "Warm";
    } else if (suhu <= 40) {
      valueSuhu = "Hot";
    } else {
      valueSuhu = "Extreme Hot";
    }

    const mainRef = db.collection("main");

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
        jam: formattedTime,
        tanggal: formattedDate,
        dateTime: currentTime,
      },
    };

    res.status(201).json({
      message: "Data added successfully",
      data: responseData,
    });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ error: "An error occurred while processing your request" });
  }
};

module.exports = {
  readData,
  createData,
  readOneLastData,
  readDataAirPerDay,
  readDataAirPerWeek,
  readDataAirPerMonth,
  readDataTempraturePerDay,
  readDataTempraturePerWeek,
  readDataTempraturePerMonth,
  readAverageDataAirPerDay,
  readAverageDataAirPerWeek,
  readAverageDataAirPerMonth,
  readAverageDataTempraturePerDay,
  readAverageDataTempraturePerWeek,
  readAverageDataTempraturePerMonth
};
