import * as Yup from "yup";

const ProfileSchema = Yup.object().shape({
  username: Yup.string().required("Username is required"),
  email: Yup.string().email("Invalid email").required("Email is required"),
  bio: Yup.string(),
  address: Yup.string(),
  city: Yup.string(),
  mobile: Yup.string().matches(/^[0-9]+$/, "Mobile must be a number"),
});

export default ProfileSchema;
