require("dotenv").config();
const axios = require("axios");
const qs = require("qs");

class GmailAPI {
  accessToken = "";
  constructor() {
    this.accessToken = this.getAcceToken();
  }

  getAcceToken = async () => {
    const data = qs.stringify({
      client_id: process.env.CLIENT_ID_GMAIL,
      client_secret: process.env.CLIENT_SECRET_GMAIL,
      refresh_token: process.env.REFRESH_TOKEN_GMAIL,
      grant_type: "refresh_token",
    });
    const config = {
      method: "post",
      url: process.env.API_URL_GMAIL,
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      data: data,
    };

    let accessToken = "";

    await axios(config)
      .then(async function (response) {
        accessToken = await response.data.access_token;

        console.log("Access Token " + accessToken);
      })
      .catch(function (error) {
        console.log(error);
      });

    return accessToken;
  };

  searchGmail = async (searchItem) => {
    const config1 = {
      method: "get",
      url:
        "https://www.googleapis.com/gmail/v1/users/me/messages?q=" + searchItem,
      headers: {
        Authorization: `Bearer ${await this.accessToken} `,
      },
    };
    const threadId = "";

    await axios(config1)
      .then(async function (response) {
        threadId = await response.data["messages"][0].id;

        console.log("ThreadId = " + threadId);
      })
      .catch(function (error) {
        console.log(error);
      });
    return threadId;
  };

  readGmailContent = async (messageId) => {
    const config = {
      method: "get",
      url: `https://gmail.googleapis.com/gmail/v1/users/me/messages/${messageId}`,
      headers: {
        Authorization: `Bearer ${await this.accessToken}`,
      },
    };

    const data = {};

    await axios(config)
      .then(async function (response) {
        data = await response.data;
      })
      .catch(function (error) {
        console.log(error);
      });
    return data;
  };

  readInboxContent = async (searchText) => {
    const threadId = await this.searchGmail(searchText);
    const message = await this.readGmailContent(threadId);
    const encodedMessage = await message.payload["parts"][0].body.data;
    const decodedStr = Buffer.from(encodedMessage, "base64").toString("ascii");

    console.log(decodedStr);

    return decodedStr;
  };
}

module.exports = new GmailAPI();
