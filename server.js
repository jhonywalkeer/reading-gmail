const gmail = require("./services/GmailApi");

gmail.readInboxContent(process.env.READ_INBOX_GMAIL);
