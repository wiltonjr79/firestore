require('dotenv').config()
const admin = require('firebase-admin');
const { of, parallel } = require('fluture')
const FIRESTORE_ENVIRONMENT_ID = process.env.FIRESTORE_ENVIRONMENT_ID

const base64ToJson = base64 => JSON.parse(Buffer.from(base64, 'base64').toString())

const initialDB = () =>
  of(
    admin.initializeApp({
      credential: admin.credential.cert(base64ToJson( process.env.GCLOUD_SERVICE_KEY)),
    })
  )

initialDB()

const stringify = product => console.log('========\n', JSON.stringify(product))

const db = admin.firestore();

var productQuey = (productId) => db.collection(`envs/${FIRESTORE_ENVIRONMENT_ID}/product`).where('id', '==', productId).get()

var skuQuery = (skuId) => db.collection(`envs/${FIRESTORE_ENVIRONMENT_ID}/sku`).where('id', '==', skuId).get()


const getAllCategories = () => db.collection(`envs/${FIRESTORE_ENVIRONMENT_ID}/category`).get()

var getSku = ({skus}) => {
  skus.forEach(sku => {
    console.log(`=======SKU: ${sku} ======`)
    skuQuery(sku).then(snapshot => {
      snapshot.forEach((doc) => {
        console.log(doc.id, '=>', doc.data());
      });
    }, err => {
      console.log(`Encountered error: ${err}`);
    });
  })
}

var getProduct = (productId) => {
  console.log(`=======Product: ${productId} ======`)
  productQuey(productId).then(snapshot => {
    snapshot.forEach((doc) => {
      console.log(doc.id, '=>', doc.data());
      getSku(doc.data())
    });
  }, err => {
    console.log(`Encountered error: ${err}`);
  })
}

const getProductByCategoryName = category => {
  //array-contains does not work with objects. 
  //Must return all objects
  getAllCategories().then(snapshot => {
    //console.log(snapshot)
    snapshot.forEach((doc) => {
      if (doc.data().name['en-CA'] === category)
        console.log('================ \n', doc.data());
    })
  }, err => {
    console.log(`Encountered error: ${err}`);
  })
}

// getProduct('0000601')

getProductByCategoryName('Jumpsuits')

