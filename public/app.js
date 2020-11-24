async function main() {
  const auth = firebase.auth();

  const signed_in = document.getElementById("signed_in");
  const signed_out = document.getElementById("signed_out");

  const create_account_button = document.getElementById("create_account_button");
  const sign_in_button = document.getElementById("sign_in_button");
  const sign_out_button = document.getElementById("sign_out_button");

  const sign_in_modal = document.getElementById("sign_in_modal");
  const user_details_modal = document.getElementById("user_details_modal");
  const locations_modal = document.getElementById("locations_modal");

  const location_label = document.getElementById("location");

  const user_details = document.getElementById("user_details");

  create_account_button.onclick = () => {
    const email = document.getElementById("email_input").value;
    const password = document.getElementById("password_input").value;
    firebase.auth().createUserWithEmailAndPassword(email, password).then((user) => {
      // console.log("new account");
      sign_in_modal.classList.remove('is-active');
    }).catch((e) => {
      console.log(e);
    });
  }

  sign_in_button.addEventListener('click', () => {
    const email_input = document.getElementById("email_input")
    const email = email_input.value;
    const password_input = document.getElementById("password_input")
    const password = password_input.value;
    const password_alert = document.getElementById("password_alert");
    firebase.auth().signInWithEmailAndPassword(email, password).then((user) => {
      // console.log("logged in");
      sign_in_modal.classList.remove('is-active');
      password_input.classList.remove("is-danger");
      password_alert.classList.add("is-hidden");
    }).catch((e) => {
      console.log(e);
      if (e.code == "auth/wrong-password") {
        password_input.classList.add("is-danger");
        password_alert.classList.remove("is-hidden");
        password_alert.innerHTML = "incorrect password";
      }
    });
  });

  sign_out_button.onclick = () => {
    auth.signOut().then(() => {
      // console.log("signed out");
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
      user_details.innerHTML = `
                                <p><span class="has-text-weight-bold">Email:</span> ${user.email}</p>
                                <p><span class="has-text-weight-bold">Password:</span> ••••••••••••</p>
                                <p><span class="has-text-weight-bold">ID:</span> ${user.uid}</p>
                               `;
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

        const { serverTimestamp } = firebase.firestore.FieldValue;

        locations_ref.add({
          uid: user.uid,
          name: place_input.value,
          timestamp: serverTimestamp()
        })
      }

      unsubscribe = locations_ref.where('uid', '==', user.uid).onSnapshot(querySnapshot => {
        const locations = querySnapshot.docs.map(doc => `
          <li>
            <a class="favorite_location" data-name="${doc.data().name}">
              ${doc.data().name}</a>
            <button class="location_delete delete" data-id="${doc.id}"</button>
          </li>
          `)
        locations_list.innerHTML = locations.join('');
        Array.from(document.getElementsByClassName("location_delete")).forEach(a => {
          a.addEventListener('click', function () {
            let place_id = this.dataset.id;
            locations_ref.doc(place_id).delete();
          });
        });
        Array.from(document.getElementsByClassName("favorite_location")).forEach(a => {
          a.addEventListener('click', function () {
            let place_name = this.dataset.name;
            // console.log(place_name);

            orrery.newLocation(place_name);
            locations_modal.classList.remove('is-active');
          })
        });
      });
    }
  });


  // MODAL TOGGLES
  // sign in
  const sign_in_control_button = document.getElementById('sign_in_control_button');
  sign_in_control_button.addEventListener('click', function () {
    sign_in_modal.classList.add('is-active');
  })
  const close_sign_in_modal = document.getElementById('close_sign_in_modal');
  close_sign_in_modal.addEventListener('click', function () {
    sign_in_modal.classList.remove('is-active');
  })
  // user details
  const user_details_control_button = document.getElementById('user_details_control_button');
  user_details_control_button.addEventListener('click', function () {
    user_details_modal.classList.add('is-active');
  })
  const close_user_details_modal = document.getElementById('close_user_details_modal');
  close_user_details_modal.addEventListener('click', function () {
    user_details_modal.classList.remove('is-active');
  })
  // locations
  const locations_control_button = document.getElementById('locations_control_button');
  locations_control_button.addEventListener('click', function () {
    locations_modal.classList.add('is-active');
  })
  const close_locations_modal = document.getElementById('close_locations_modal');
  close_locations_modal.addEventListener('click', function () {
    locations_modal.classList.remove('is-active');
  })
  // info
  const info_control_button = document.getElementById('info_control_button');
  info_control_button.addEventListener('click', function () {
    info_modal.classList.add('is-active');
  })
  const close_info_modal = document.getElementById('close_info_modal');
  close_info_modal.addEventListener('click', function () {
    info_modal.classList.remove('is-active');
  })

  // Orrery
  const stars = document.getElementById("stars");

  const width = stars.width = window.innerWidth;
  const height = stars.height = window.innerHeight;

  let orrery = new Orrery(stars, width, height, star_data);

  const go_to_location_button = document.getElementById('go_to_location_button');
  go_to_location_button.addEventListener('click', function () {
    let place_name = place_input.value;
    orrery.newLocation(place_name);
    locations_modal.classList.remove('is-active');
  })
}

class Orrery {
  constructor(canvas, width, height, data) {
    this.canvas = canvas;
    this.background = 'rgb(253, 131, 117)';

    this.ctx = canvas.getContext('2d');
    this.width = width;
    this.height = height;
    this.geo = { // chapel hill
      "lat": 35.9131542,
      "lng": -79.05578
    }

    this.data = data;


    // for (let i = 0; i < 128; i++) {
    //   this.renderStar(Math.random() * 24, Math.random() * 90, Math.random() * 20);
    // }

    this.renderSky();

  }

  newLocation = async function (place) {
    // const coords = await fetch(`https://api.opencagedata.com/geocode/version/format?q=${encodeURIComponent(place)}&key=945b5f78ec9a4112a87cf57b70fb10e7`);
    const response = await this.nameToCoordinates(place);
    // console.log(response);
    const location_name = response.results[0].formatted;
    const geo = response.results[0].geometry;

    const location_label = document.getElementById("location");
    location_label.innerHTML = location_name;
    // console.log(geo);
    this.geo = geo;
    this.renderSky();
  }

  nameToCoordinates = async function (query) {
    return opencage.geocode({ q: query, key: '945b5f78ec9a4112a87cf57b70fb10e7' });
  }

  renderSky = function () {
    const ra_start = 11.4;
    const ra_end = 12.6;
    const dec_start = this.geo.lat - 4;
    const dec_end = this.geo.lat + 4;
    const ra_range = ra_end - ra_start;
    const dec_range = dec_end - dec_start;

    // console.log(this.geo);

    this.ctx.fillStyle = 'rgb(0,0,0)';
    this.ctx.globalAlpha = 1;
    this.ctx.fillRect(0, 0, this.width, this.height);
    this.data.forEach(a => {
      if (a.ra >= ra_start && a.ra <= ra_end && a.dec >= dec_start && a.dec <= dec_end) {
        this.renderStar((a.ra - ra_start) / ra_range * this.width, (a.dec - dec_start) / dec_range * this.height, a.mag / 20)
      }
    })
  }

  renderStar = function (x, y, lum) {
    this.ctx.fillStyle = `rgb(255,255,255)`;
    this.ctx.globalAlpha = lum;
    this.ctx.beginPath();
    this.ctx.arc(x, y, 3.2, 0, 2 * Math.PI, false);
    this.ctx.fill();
  }
}

document.addEventListener("DOMContentLoaded", main);