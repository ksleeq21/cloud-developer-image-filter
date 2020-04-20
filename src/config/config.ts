export const config = {
  "dev": {
    "username": process.env.PG_USERNAME,
    "password": process.env.PG_PASSWORD,
    "database": process.env.PG_DBNAME,
    "host": process.env.PG_HOST,
    "dialect": process.env.DIRECT,
    "aws_region": process.env.REGION,
    "aws_profile": process.env.PROFILE_NAME,
    "aws_media_bucket": process.env.AWS_MEDIA_BUCKET
  },
  "jwt": {
    "secret": process.env.JWT_SECRET
  },
  "prod": {
    "username": process.env.PG_USERNAME,
    "password": process.env.PG_PASSWORD,
    "database": process.env.PG_DBNAME,
    "host": process.env.PG_HOST,
    "dialect": process.env.DIRECT,
    "aws_region": process.env.REGION,
    "aws_profile": process.env.PROFILE_NAME,
    "aws_media_bucket": process.env.AWS_MEDIA_BUCKET
  }
}
