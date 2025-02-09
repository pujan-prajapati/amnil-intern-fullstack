import * as dotenv from "dotenv";
import * as passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import { Auth } from "../entity/auth.entity";

dotenv.config();

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLINET_SECRET!,
      callbackURL: "http://localhost:8000/auth/google/callback",
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        let user = await Auth.findOneBy({ googleId: profile.id });

        if (!user) {
          user = Auth.create({
            username: profile.displayName,
            email: profile.emails?.[0]?.value,
            avatar: profile.photos?.[0]?.value,
            googleId: profile.id,
          });

          await user.save();
        }

        done(null, user);
      } catch (err) {
        done(err, null);
      }
    }
  )
);

// Serialize user for the session
passport.serializeUser((user: any, done) => {
  done(null, user.id);
});

// Deserialize user from the session
passport.deserializeUser(async (id: string, done) => {
  try {
    const user = await Auth.findOneBy({ id });
    done(null, user);
  } catch (err) {
    done(err, null);
  }
});
