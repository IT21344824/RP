from flask import current_app, render_template
import cloudinary
from cloudinary.uploader import destroy
import cloudinary.api
import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from flask import current_app




def configure_cloudinary():
    """Set up Cloudinary configuration using current_app context."""
    cloudinary.config(
        cloud_name=current_app.config['CLOUDINARY_CLOUD_NAME'],
        api_key=current_app.config['CLOUDINARY_API_KEY'],
        api_secret=current_app.config['CLOUDINARY_API_SECRET']
    )
    print(f"Cloudinary Config: {current_app.config['CLOUDINARY_CLOUD_NAME']}, {current_app.config['CLOUDINARY_API_KEY']}")


# Function to upload image to Cloudinary
def upload_image_to_cloudinary(image_file, folder_name="user_images"):
    try:
        result = cloudinary.uploader.upload(image_file, folder=folder_name)
        print(f"Cloudinary upload result: {result}")  # Check the full result for debugging
        # Return the secure URL and public ID of the uploaded image
        return result['secure_url'], result['public_id']
    except cloudinary.exceptions.Error as e:
        print(f"Cloudinary-specific error: {e}")  # Cloudinary-specific errors
        return f"Cloudinary error: {str(e)}"
    except Exception as e:
        print(f"General error: {e}")  # General error if any
        return f"General error: {str(e)}"

def delete_image_from_cloudinary(public_id):
    try:
        print(f"Attempting to delete image with public_id: {public_id}")  # Debugging: log public_id being deleted
        
        # Ensure the public_id includes the folder path
        if not public_id.startswith("user_images/"):
            public_id = f"user_images/{public_id}"

        # Log the final public_id before calling Cloudinary
        print(f"Final public_id for deletion: {public_id}")

        # Call Cloudinary API to delete the image
        delete_result = destroy(public_id)
        
        # Log the full result of the deletion attempt
        print(f"Cloudinary deletion result: {delete_result}")  # Debugging: log full response from Cloudinary

        if delete_result.get("result") == "ok":
            return True
        else:
            print(f"Failed to delete image. Cloudinary response: {delete_result}")
            return False
    except Exception as e:
        print(f"Error deleting image from Cloudinary: {e}")
        return False


def send_email_via_smtp(to_email, subject, pin, username):
    try:
        # Set up the server
        server = smtplib.SMTP(current_app.config['MAIL_SERVER'], current_app.config['MAIL_PORT'])
        server.starttls()  # Secure the connection using TLS

        # Log in to the SMTP server
        server.login(current_app.config['MAIL_USERNAME'], current_app.config['MAIL_PASSWORD'])

        # Create the email message
        msg = MIMEMultipart()
        msg['From'] = current_app.config['MAIL_USERNAME']
        msg['To'] = to_email
        msg['Subject'] = subject
        
        # Render the HTML email body
        email_body = render_template('reset.html', pin=pin, username=username)  # Use the reset.html template to render the body

        # Attach the HTML body to the email
        msg.attach(MIMEText(email_body, 'html'))  # Specify the email body as HTML

        # Send the email
        server.sendmail(current_app.config['MAIL_USERNAME'], to_email, msg.as_string())

        # Close the server connection
        server.quit()

        return "Email sent successfully!"  # Success message
    except Exception as e:
        return f"Failed to send email: {str(e)}"  # Error message
