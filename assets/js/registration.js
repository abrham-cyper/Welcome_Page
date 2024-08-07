document.addEventListener('DOMContentLoaded', async function () {
  try {
      var doc = new BeeStore({path: `Applications/${uid}`});
      var applicationResponse = await doc.getDoc();
      
      if (applicationResponse != null) {
          try {
              var beeAuth = new BeeAuth();
              var otpStateResponse = await beeAuth.otpState();
              console.log('OTP State:', otpStateResponse);

              if (otpStateResponse === true) {
                  window.location.href = "./verification.html";
              } else if (otpStateResponse === "Account already verified") {
                  window.location.href = "./home.html";
              } else {
                  // Handle other cases if needed
              }
          } catch (error) {
              console.error('Error during OTP state or request:', error);
          }
      }
  } catch (error) {
      console.error('Error fetching application data:', error);
  }
});

function navigateToHome(){
  window.location.href = "./home.html";
}

var isLoading = false;

function setMaxDate() {
  var maxDate = new Date();
  var minDate = new Date();
  maxDate.setFullYear(maxDate.getFullYear() + 10);
  var formattedMaxDate = maxDate.toISOString().split('T')[0];
  var formattedMinDate = minDate.toISOString().split('T')[0];
  var passportExpiryDate = document.getElementById("passport-expiry-date");
  passportExpiryDate.setAttribute("max", formattedMaxDate);
  passportExpiryDate.setAttribute("min", formattedMinDate);
}

setMaxDate();

document.getElementById('company-form').addEventListener('submit', async function (event) {
  event.preventDefault();

  // Get all form values
  var formData = {
    companyName: document.getElementById('company-name').value.trim(),
    businessOwnerName: document.getElementById('business-owner-name').value.trim(),
    telephone: document.getElementById('telephone').value.trim(),
    email: document.getElementById('email').value.trim(),
    passportNumber: document.getElementById('passport-number').value.trim(),
    passportExpiryDate: document.getElementById('passport-expiry-date').value.trim(),
    legalGround: document.getElementById('legal-ground').value.trim(),
    balanceNumber: document.getElementById('balance-number').value.trim(),
    balanceWords: document.getElementById('balance-words').value.trim(),
    businessYears: document.getElementById('business-years').value.trim(),
    businessNumberTypes: document.getElementById('business-number-types').value.trim(),
    landAmount: document.getElementById('land-amount').value.trim(),
    country: document.getElementById('country').value.trim(),
    region: document.getElementById('region').value.trim(),
    city: document.getElementById('city').value.trim(),
    subcity: document.getElementById('subcity').value.trim(),
    revenueAmount: document.getElementById('revenue-amount').value.trim(),
    machineStatus: document.getElementById('machine-status').value.trim(),
    machineType: document.getElementById('machine-type').value.trim(),
    machineSize: document.getElementById('machine-size').value.trim(),
    machineQuantity: document.getElementById('machine-number').value.trim(),
    machinePrice: document.getElementById('machine-price').value.trim(),
    machineBrandName: document.getElementById('machine-brand-name').value.trim(),
    machineMemorySize: document.getElementById('machine-memory-size').value.trim(),
    machineDescription: document.getElementById('machine-description').value.trim(),
    businessPurpose: document.getElementById('business-purpose').value.trim(),
    legalOwnerName: document.getElementById('legal-owner-name').value.trim(),
    transparencyAgreementCheckbox: document.getElementById('transparency-agreement').checked,
    legalGroundFile: document.getElementById('legal-ground-file').files[0],
    landCertificates: document.getElementById('land-certificates').files[0]
  };

  // Validation
  if (!formData.companyName || !formData.businessOwnerName || !formData.telephone || !formData.email ||
    !formData.passportNumber || !formData.passportExpiryDate || !formData.legalGround || !formData.legalGroundFile ||
    !formData.balanceNumber || !formData.balanceWords || !formData.businessYears || !formData.businessNumberTypes ||
    !formData.landAmount || !formData.landCertificates || !formData.country ||
    (!formData.revenueAmount && formData.machineStatus && formData.machineType && formData.machineSize && formData.machineQuantity &&
      formData.machinePrice && formData.machineBrandName && formData.machineMemorySize && formData.machineDescription &&
      formData.businessPurpose && formData.legalOwnerName)) {
    return showSnackBar("Please fill all the required fields.");
  } else if (!isName(formData.companyName) || !isName(formData.businessOwnerName) || !isName(formData.balanceWords)) {
    return showSnackBar("Please enter valid names.");
  } else if (!validateEmail(formData.email)) {
    return showSnackBar("Please enter a valid email address.");
  } else if (!validatePhoneNumber(formData.telephone)) {
    return showSnackBar("Please enter a valid phone number.");
  }else if (!formData.transparencyAgreementCheckbox) {
    showSnackBar("Please agree to the terms and conditions.");
    return;
  }

  try {
    isLoading = true;
    updateProgress();
    if(uid == null){
      window.location.href = "./login.html";
      return;
    }
    // Upload legal ground file
    const legalGroundFileURL = await uploadFile(formData.legalGroundFile, `Documents/${uid}/${formData.legalGroundFile.name}`);

    // Upload land certificates file
    const landCertificatesURL = await uploadFile(formData.landCertificates, `Documents/${uid}/${formData.landCertificates.name}`);

    if (landCertificatesURL != null && legalGroundFileURL != null) {
      // Register the data and get response status
      const responseStatus = await register(uid, formData, legalGroundFileURL, landCertificatesURL);

      if (responseStatus === 200) {
        showAlert("Registration successful. You will receive a confirmation call or email soon.");
      } else {
        showSnackBar("Failed to register. Please try again later.");
      }
    } else {
      showSnackBar("Failed to register. Please try again later.");

    }
  } catch (error) {
    // console.error("Error creating user:", error);
    // showSnackBar("Failed to create account. Please try again later.");
  }

  isLoading = false;
  updateProgress();
});

function updateProgress() {
  const progressOverlay = document.getElementById('progressOverlay');
  if (isLoading) {
    progressOverlay.style.display = 'flex';
  } else {
    progressOverlay.style.display = 'none';
  }
}

function showAlert(message) {
  document.getElementById('overlay').style.display = 'block';
  document.getElementById('messageBox').style.display = 'block';
  document.getElementById('modal-message').textContent = message;
}

function showSnackBar(message) {
  var snackbar = document.getElementById('snackbar');
  snackbar.textContent = message;
  snackbar.classList.add('show');
  setTimeout(function () {
    snackbar.classList.remove('show');
  }, 3000);
}

function hideMessageBox() {
  document.getElementById('overlay').style.display = 'none';
  document.getElementById('messageBox').style.display = 'none';
  document.getElementById('company-form').reset();
}

function isName(input) {
  return /^[a-zA-Z\s]{1,25}$/.test(input);
}

function validateEmail(email) {
  var re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
}

function validatePhoneNumber(phone) {
  var re = /^\+251\d{9}$/;
  return re.test(phone);
}


async function uploadFile(file, path) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = async function (event) {
      const uint8Array = new Uint8Array(event.target.result);
      const beeStorage = new BeeStorage();
      try {
        const response = await beeStorage.upload({ file: uint8Array, path });
        if (response) {
          resolve(`http://${address}:${storagePort}/${projectId}/${path}`);
        } else {
          reject(null);
        }
      } catch (error) {
        print(error);
        reject(null);
      }
    };
    reader.readAsArrayBuffer(file);
  });
}

async function register(uid, formData, legalGroundFileURL, landCertificatesURL) {
  try {
    var request = await new BeeStore({ path: `Applications/${uid}` }).setDoc({
      "search": `${formData.companyName}${formData.telephone}${formData.businessOwnerName}`,
      "companyName": formData.companyName,
      "businessOwnerName": formData.businessOwnerName,
      "telephone": formData.telephone,
      "email": formData.email,
      "passportNumber": formData.passportNumber,
      "passportExpiryDate": formData.passportExpiryDate,
      "legalGround": formData.legalGround,
      "balanceNumber": formData.balanceNumber,
      "balanceWords": formData.balanceWords,
      "businessYears": formData.businessYears,
      "businessNumberTypes": formData.businessNumberTypes,
      "landAmount": formData.landAmount,
      "country": formData.country,
      "region": formData.region,
      "city": formData.city,
      "subcity": formData.subcity,
      "revenueAmount": formData.revenueAmount,
      "machineStatus": formData.machineStatus,
      "machineType": formData.machineType,
      "machineSize": formData.machineSize,
      "machineQuantity": formData.machineQuantity,
      "machinePrice": formData.machinePrice,
      "machineBrandName": formData.machineBrandName,
      "machineMemorySize": formData.machineMemorySize,
      "machineDescription": formData.machineDescription,
      "businessPurpose": formData.businessPurpose,
      "legalOwnerName": formData.legalOwnerName,
      "timeStamp": Date.now(),
      "legalGroundFileURL": legalGroundFileURL,
      "landCertificatesURL": landCertificatesURL,
    },  {hasDocId: true});
    if (request == true) { return 200; }
  } catch (error) {
    throw new Error("Error registering data: " + error);
  }
}
