var apiKey = "CN1-MpyNGh";
var projectId = "crypto";
var storePort = 1434;
var authPort = 1435;
var storagePort = 1437;
var address = "172.21.35.226";
const i = localStorage;
var sid = i.getItem("sId");
var uid = i.getItem("uid");
var token;

document.addEventListener('DOMContentLoaded', async function () {
  await initializeSession();
});

async function initializeSession() {
  try {
    const connect = await fetch(`http://${address}:${authPort}/${apiKey.split("-")[1]}/session`);
    const publicKeyPem = await connect.text();
    token = await rsaEncrypt(publicKeyPem, sid);
  } catch (e) {
    console.error('Error initializing session:', e);
  }
}

class BeeStore {
  constructor({ path }) {
    this.path = path;
  }

  async getDoc({ field } = {}) {
    await initializeSession();
    const url = `http://${address}:${storePort}/${apiKey.split("-")[1]}/${this.path}${(field || token) ? `?${field ? `field=${field}` : ''}${field && token ? '&' : ''}${token ? `token=${token}` : ''}` : ''}`;
    try {
      const response = await fetch(url);
      if (response.status === 200) {
        return response.json();
      } else {
        console.error('Error fetching document:', response.statusText);
        return null;
      }
    } catch (e) {
      console.error('Error fetching document:', e);
      return null;
    }
  }

  async getQuerySnapshot({ field, type, value, startFrom, fields, onlyId, end } = {}) {
    await initializeSession();
    const url = `http://${address}:${storePort}/${apiKey.split("-")[1]}/readSnapshotQuery`;
    const data = {
      path: `${this.path}`,
      filters: [{ field, type, value }],
      onlyId: onlyId,
      field: fields,
      token: token,
      start: startFrom,
      end: end,
      reversed: true
    };
    try {
      const response = await fetch(url, {
        method: "POST",
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
      });
      if (response.status === 200) {
        return response.json();
      } else {
        console.error('Error fetching query snapshot:', response.statusText);
        return null;
      }
    } catch (e) {
      console.error('Error fetching query snapshot:', e);
      return null;
    }
  }

  async setDoc(data, { hasDocId } = {}) {
    await initializeSession();
    const url = `http://${address}:${storePort}/${apiKey.split("-")[1]}/set`;
    const temp = {
      path: this.path,
      data: data,
      hasDocId: hasDocId,
      token: token
    };
    try {
      const response = await fetch(url, {
        method: "POST",
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(temp)
      });
      if (response.status === 200) {
        return true;
      } else {
        console.error('Error setting document:', response.statusText);
        return false;
      }
    } catch (e) {
      console.error('Error setting document:', e);
      return null;
    }
  }
}

async function rsaEncrypt(publicKeyPem, plaintext) {
  const encrypt = new JSEncrypt();
  encrypt.setPublicKey(publicKeyPem);
  return encrypt.encrypt(plaintext);
}

class BeeAuth {
  async signup(email, password) {
    const url = `http://${address}:${authPort}/${apiKey.split("-")[1]}`;
    try {
      const connect = await fetch(url);
      const publicKeyPem = await connect.text();
      const encryptedEmail = await rsaEncrypt(publicKeyPem, email);
      const encryptedPassword = await rsaEncrypt(publicKeyPem, password);
      const request = await fetch(`${url}/signup`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ ctoken: encryptedEmail, key: encryptedPassword })
      });
      if (request.status === 200) {
        const r = await request.json();
        i.setItem("sId", r.sessionId);
        sid = r.sessionId;
        return { body: r, statusCode: request.status };
      } else {
        return { body: await request.text(), statusCode: request.status };
      }
    } catch (e) {
      console.error('Error signing up:', e);
      return { body: "Failed to connect", statusCode: 404 };
    }
  }

  async requestOTP() {
    await initializeSession();
    const url = `http://${address}:${authPort}/${apiKey.split("-")[1]}`;
    try {
      const request = await fetch(`${url}/requestOTP`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ uid: uid, token: token })
      });
      if (request.status === 200) {
        return true;
      } else {
        console.error('Error requesting OTP:', request.statusText);
        return false;
      }
    } catch (e) {
      console.error('Error requesting OTP:', e);
      return { body: "Failed to connect", statusCode: 404 };
    }
  }

  async requestResetLink(email) {
    const url = `http://${address}:${authPort}/${apiKey.split("-")[1]}`;
    try {
      const connect = await fetch(url);
      const publicKeyPem = await connect.text();
      const request = await fetch(`${url}/reqResetLink`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email: await rsaEncrypt(publicKeyPem, email) })
      });
      if (request.status === 200) {
        return true;
      } else {
        console.error('Error requesting reset link:', request.statusText);
        return false;
      }
    } catch (e) {
      console.error('Error requesting reset link:', e);
      return { body: "Failed to connect", statusCode: 404 };
    }
  }

  async verifyOTP(otp) {
    await initializeSession();
    const url = `http://${address}:${authPort}/${apiKey.split("-")[1]}`;
    try {
      const request = await fetch(`${url}/verifyOTP`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ uid: uid, otp: otp, token: token })
      });
      if (request.status === 200) {
        return true;
      } else {
        console.error('Error verifying OTP:', request.statusText);
        return false;
      }
    } catch (e) {
      console.error('Error verifying OTP:', e);
      return { body: "Failed to connect", statusCode: 404 };
    }
  }

  async otpState() {
    await initializeSession();
    const url = `http://${address}:${authPort}/${apiKey.split("-")[1]}`;
    try {
      const request = await fetch(`${url}/otpState`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ uid: uid, token: token })
      });
      if (request.status === 200) {
        return request.text();
      } else {
        console.error('Error getting OTP state:', request.statusText);
        return false;
      }
    } catch (e) {
      console.error('Error getting OTP state:', e);
      return { body: "Failed to connect", statusCode: 404 };
    }
  }

  async login(email, password) {
    const url = `http://${address}:${authPort}/${apiKey.split("-")[1]}`;
    try {
      const connect = await fetch(url);
      const publicKeyPem = await connect.text();
      const encryptedEmail = await rsaEncrypt(publicKeyPem, email);
      const encryptedPassword = await rsaEncrypt(publicKeyPem, password);
      const request = await fetch(`${url}/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ token: encryptedEmail, key: encryptedPassword })
      });
      if (request.status === 200) {
        const r = await request.json();
        i.setItem("sId", r.sessionId);
        return { body: r, statusCode: request.status };
      } else {
        return { body: await request.text(), statusCode: request.status };
      }
    } catch (e) {
      console.error('Error logging in:', e);
      return { body: "Failed to connect", statusCode: 404 };
    }
  }
}

class BeeStorage {
  async upload({ file, path } = {}) {
    await initializeSession();
    const url = `http://${address}:${storagePort}/upload`;
    const data = {
      apiKey: apiKey.split("-")[1],
      token: token,
      action: "upload",
      files: {
        path: path,
        data: Array.from(file)
      },
    };
    try {
      const response = await fetch(url, {
        method: "POST",
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
      });
      if (response.status === 200) {
        return true;
      } else {
        console.error('Error uploading file:', response.statusText);
        return false;
      }
    } catch (e) {
      console.error('Error uploading file:', e);
      return null;
    }
  }
}
