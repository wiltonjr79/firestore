const admin = require('firebase-admin');

admin.initializeApp({
    credential: admin.credential.applicationDefault(),
    databaseURL: 'https://digital-builder-xyx.firebaseio.com'
  });

const db = admin.firestore();

var productQuey = (productId) => db.collection('envs/jason/product').where('id', '==', productId).get()

var skuQuery = (skuId) => db.collection('envs/jason/sku').where('id', '==', skuId).get()

// var getSkus = ({skus}) => {
//   skus.forEach(sku => {
//     console.log(`=======SKU: ${sku} ======`)
//     skuQuery(sku).then(snapshot => {
//       snapshot.forEach((doc) => {
//         console.log(doc.id, '=>', doc.data());
//       });
//     }, err => {
//       console.log(`Encountered error: ${err}`);
//     });
//   })
// }
 
skusResult = []

const getSku = async (skuId) => {
  let docs = []
  await skuQuery(skuId).then(result => {
    for (doc of result.docs) {
      docs = [...docs, doc.data()]
    }
  })
  return docs
}

const getSkus = async ({skus}) => {
  let arrSku = []
  await skus.forEach( async sku => {
    await getSku(sku).then(result => arrSku = [...arrSku, getSku(sku)] )
  })
  return arrSku
}


const getProduct = async (productId) => {
  let product = []
  await productQuey(productId).then ( result => {
    for (doc of result.docs) {
      product = [...product, doc.data()]
    }  
  })

  return product
}

const getFullProduct = (products) => {
  products.map(product => {
    //let skus = getSkus(product)
    console.log(product)
  })  
}

//getProduct('0000601').then(result => getFullProduct(result).then(result => console.log(reuslt)), err => console.error(err))

getSkus({skus:['0000103']}).then(result => console.log(result), err => console.error(err))

//test = 
//getSkus(test)

// getProduct('0000601').then(result => ( 
//   result.docs.map(doc => product = [...doc])
// ))


//console.log(snapshot)
// snapshot.docs.map(doc => {
//   //console.log(doc.data())
//   return doc.data()
// })

//`console.log(snapshot)

