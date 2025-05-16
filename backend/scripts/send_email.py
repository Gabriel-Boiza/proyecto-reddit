import sys
import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart

def send_email(recipient_email, recipient_name):
    sender_email = "reddix.info@gmail.com"
    sender_password = "xacp tnam vzfw kgbm"
    domain = "http://localhost:5173/"
    subject = "Welcome to Our Forum Community!"
    
    # HTML content con estilo CSS inline para mejor compatibilidad
    body = f"""
    <html>
    <head>
    <style>
      body {{
        font-family: Arial, sans-serif;
        background-color: #f9f9f9;
        color: #333333;
        margin: 0;
        padding: 0;
      }}
      .container {{
        max-width: 600px;
        margin: 20px auto;
        background-color: #ffffff;
        padding: 20px;
        border-radius: 8px;
        box-shadow: 0 0 10px rgba(0,0,0,0.1);
      }}
      h2 {{
        color: #2c3e50;
      }}
      p {{
        line-height: 1.6;
        font-size: 16px;
      }}
      .footer {{
        margin-top: 30px;
        font-size: 14px;
        color: #888888;
        text-align: center;
      }}
      a.button {{
        display: inline-block;
        padding: 10px 20px;
        margin-top: 20px;
        background-color: #3498db;
        color: white !important;
        text-decoration: none;
        border-radius: 5px;
        font-weight: bold;
      }}
      a.button:hover {{
        background-color: #2980b9;
      }}
    </style>
    </head>
    <body>
      <div class="container">
        <h2>Welcome, {recipient_name}!</h2>
        <p>Thank you for registering at our forum. We are thrilled to have you as part of our growing community.</p>
        <p>Here you can share your ideas, ask questions, and connect with others who share your interests.</p>
        <p>If you have any questions or need assistance, feel free to reach out to our support team.</p>
        <p>We look forward to your active participation!</p>
        <a href="{domain}" class="button">Visit the Forum</a>
        <div class="footer">
          <p>Best regards,<br>The Forum Team</p>
        </div>
      </div>
    </body>
    </html>
    """

    msg = MIMEMultipart("alternative")
    msg['Subject'] = subject
    msg['From'] = sender_email
    msg['To'] = recipient_email

    # Adjuntar la parte HTML
    msg.attach(MIMEText(body, "html", _charset='utf-8'))

    try:
        server = smtplib.SMTP('smtp.gmail.com', 587)
        server.starttls()
        server.login(sender_email, sender_password)
        server.sendmail(sender_email, recipient_email, msg.as_string())
        server.quit()
        print("Email sent successfully")
    except Exception as e:
        print(f"Error sending email: {e}")

if __name__ == "__main__":
    if len(sys.argv) < 3:
        print("Usage: python send_email.py email name")
    else:
        send_email(sys.argv[1], sys.argv[2])
