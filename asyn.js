const admin = require("firebase-admin");
// const {node} = require{'fluture'}

admin.initializeApp({
  credential: admin.credential.applicationDefault(),
  databaseURL: "https://digital-builder-xyx.firebaseio.com"
});

const db = admin.firestore();

var productQuery = productId =>
  db
    .collection("envs/jason/product")
    .doc(productId)
    .get();

var skuQuery = skuId =>
  db
    .collection("envs/jason/sku")
    .doc(skuId)
    .get();

skusResult = [];

const getSku = async skuId => {
  let docs = [];
  await skuQuery(skuId).then(result => {
    for (doc of result.docs) {
      docs = [...docs, doc.data()];
    }
  });
  return docs;
};

const getSkus = async ({ skus }) => {
  let arrSku = [];
  await skus.forEach(async sku => {
    await getSku(sku).then(result => (arrSku = [...arrSku, getSku(sku)]));
  });
  return arrSku;
};

const getProduct = async productId => {
  let product = [];
  await productQuey(productId).then(result => {
    for (doc of result.docs) {
      product = [...product, doc.data()];
    }
  });

  return product;
};

const viewSku = id => {
  return skuQuery(id).then(doc => {
    var data = doc.data();
    return data;
  });
};

//good
// const viewSkus = (product) => {
//   final = product
//   final.skuObjs = []
//   return viewSku(product.skus[0]).then(result => {
//     final.skuObjs.push(result)
//     return final
//   })
// }

// bad
// const viewSkus = (product) => {
//   final = product
//   final.skuObjs = []
//   product.skus.map(sku => {
//     return viewSku(sku).then(result => {
//       final.skuObjs.push(result)
//       return final
//     })
//   })
// }

const viewSkus = product => {
  return product.skus.map(sku => {
    return viewSku(sku).then(result => {
      return result;
    });
  });
};

const viewProduct = id => {
  let final = [];
  return productQuery(id).then(doc => {
    var product = doc.data();
    return product;
  });
};

viewProduct("0000601")
  .then(product => Promise.all(viewSkus(product)).then(skus => ({ product, skus })))
  .then(({ product, skus }) => modify(["skus", elems], id => skus[id])(product));
// .then(skus => Promise.all(skus))
// .then(values => console.log(values));

//viewProduct('0000601').then(res => console.log(res))

//getProduct('0000601').then(result => getFullProduct(result).then(result => console.log(reuslt)), err => console.error(err))
//viewSku('0000103').then(result => console.log(result) )
//viewSkus(['0000103', '0000105']).then(result => console.log(result))

//console.log (this.test)
//getSkus({skus:['0000103']}).then(result => console.log(result), err => console.error(err))

//test =
//getSkus(test)

// getProduct('0000601').then(result => (
//   result.docs.map(doc => product = [...doc])
// ))
