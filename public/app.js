async function main() {
  const auth = firebase.auth();

  const signed_in = document.getElementById("signed_in");
  const signed_out = document.getElementById("signed_out");

  const create_account_button = document.getElementById("create_account_button");
  const sign_in_button = document.getElementById("sign_in_button");
  const sign_out_button = document.getElementById("sign_out_button");

  const sign_in_modal = document.getElementById("sign_in_modal");
  const user_details_modal = document.getElementById("user_details_modal");

  const user_details = document.getElementById("user_details");

  create_account_button.onclick = () => {
    const email = document.getElementById("email_input").value;
    const password = document.getElementById("password_input").value;
    firebase.auth().createUserWithEmailAndPassword(email, password).then((user) => {
      console.log("new account");
      sign_in_modal.classList.remove('is-active');
    }).catch((e) => {
      console.log(e);
    });
  }

  sign_in_button.onclick = () => {
    const email = document.getElementById("email_input").value;
    const password = document.getElementById("password_input").value;
    firebase.auth().signInWithEmailAndPassword(email, password).then((user) => {
      console.log("logged in");
      sign_in_modal.classList.remove('is-active');
    }).catch((e) => {
      console.log(e);
    });
  }

  sign_out_button.onclick = () => {
    auth.signOut().then(() => {
      console.log("signed out");
      user_details_modal.classList.remove('is-active');
    }).catch((e) => {
      console.log(e);
    });
  }

  auth.onAuthStateChanged(user => {
    if (user) {
      //signed in
      signed_in.classList.remove('is-hidden');
      signed_out.classList.add('is-hidden');
      user_details.innerHTML = `<p>Email: ${user.email}, ID: ${user.uid}</p>`;
    } else {
      // not signed in
      signed_in.classList.add('is-hidden');
      signed_out.classList.remove('is-hidden');
      user_details.innerHTML = '';
    }
  });


  const db = firebase.firestore();

  const add_location = document.getElementById('add_favorite_location_button');
  const place_input = document.getElementById('place_input');
  const locations_list = document.getElementById('favorite_locations');

  let locations_ref;
  let unsubscribe;

  auth.onAuthStateChanged(user => {
    if (user) {
      locations_ref = db.collection('locations');

      add_location.onclick = () => {

        console.log(geo);
        locations_ref.add({
          uid: user.uid,
          name: place_input.value,
        })
      }

      unsubscribe = locations_ref.where('uid', '==', user.uid).onSnapshot(querySnapshot => {
        const locations = querySnapshot.docs.map(doc => `<li>${doc.data().name}</li>`)
        locations_list.innerHTML = locations.join('');
      });

    }
  });

  function nameToCoordinates(query) {
    opencage
      .geocode({ q: query, key: '945b5f78ec9a4112a87cf57b70fb10e7' })
      .then((data) => {
        let first = data.results[0].geometry;
        console.log(first.lat, first.lng);
        return first;
      })
      .catch((error) => {
        console.log('error', error.message);
        return "coordinates not found"
      });
  }

  // modal toggles
  const sign_in_control_button = document.getElementById('sign_in_control_button');
  sign_in_control_button.addEventListener('click', function () {
    sign_in_modal.classList.add('is-active');
  })
  const close_sign_in_modal = document.getElementById('close_sign_in_modal');
  close_sign_in_modal.addEventListener('click', function () {
    sign_in_modal.classList.remove('is-active');
  })
  const user_details_control_button = document.getElementById('location_control_button');
  sign_in_control_button.addEventListener('click', function () {
    user_details_modal.classList.add('is-active');
  })
  const close_user_details_modal = document.getElementById('close_user_details_modal');
  close_sign_in_modal.addEventListener('click', function () {
    user_details_modal.classList.remove('is-active');
  })
}

document.addEventListener("DOMContentLoaded", main);