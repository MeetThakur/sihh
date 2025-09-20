# MongoDB Atlas Setup Guide for KhetSetu

This guide will help you set up MongoDB Atlas (cloud database) for your KhetSetu project in just a few minutes.

## Why MongoDB Atlas?

- ✅ Free tier available (512 MB storage)
- ✅ No local installation required
- ✅ Automatic backups and security
- ✅ Global availability
- ✅ Easy scaling

## Step-by-Step Setup

### 1. Create MongoDB Atlas Account

1. Go to [https://www.mongodb.com/atlas](https://www.mongodb.com/atlas)
2. Click **"Try Free"**
3. Sign up with your email or Google account
4. Complete email verification

### 2. Create Your First Cluster

1. **Choose Deployment Type**: Select **"M0 Cluster"** (Free tier)
2. **Cloud Provider**: Choose **AWS**, **Google Cloud**, or **Azure**
3. **Region**: Select the region closest to you
4. **Cluster Name**: Keep default or name it `khetsetu-cluster`
5. Click **"Create Cluster"** (takes 1-3 minutes)

### 3. Create Database User

1. Go to **"Database Access"** in the left sidebar
2. Click **"+ ADD NEW DATABASE USER"**
3. **Authentication Method**: Choose **"Password"**
4. **Username**: `khetsetu`
5. **Password**: Click **"Autogenerate Secure Password"** and copy it
6. **Database User Privileges**: Select **"Read and write to any database"**
7. Click **"Add User"**

⚠️ **IMPORTANT**: Save your password somewhere safe!

### 4. Configure Network Access

1. Go to **"Network Access"** in the left sidebar
2. Click **"+ ADD IP ADDRESS"**
3. For development, click **"ALLOW ACCESS FROM ANYWHERE"**
   - This adds `0.0.0.0/0` (not recommended for production)
4. For production, click **"ADD CURRENT IP ADDRESS"**
5. Click **"Confirm"**

### 5. Get Connection String

1. Go to **"Database"** in the left sidebar
2. Click **"Connect"** on your cluster
3. Choose **"Connect your application"**
4. **Driver**: Select **"Node.js"**
5. **Version**: Select **"4.1 or later"**
6. Copy the connection string - it looks like:
   ```
   mongodb+srv://khetsetu:<password>@khetsetu-cluster.xxxxx.mongodb.net/?retryWrites=true&w=majority
   ```

### 6. Configure Your Backend

1. Open your `backend/.env` file
2. Replace `<password>` in the connection string with your actual password
3. Add the database name `khetsetu` at the end:

```env
# MongoDB Atlas Configuration
MONGODB_URI=mongodb+srv://khetsetu:YOUR_PASSWORD_HERE@khetsetu-cluster.xxxxx.mongodb.net/khetsetu?retryWrites=true&w=majority

# Other required environment variables
NODE_ENV=development
PORT=5000
JWT_SECRET=your-super-secret-jwt-key-make-it-long-and-random-at-least-32-characters
JWT_EXPIRES_IN=7d
GEMINI_API_KEY=your-gemini-api-key-here
```

### 7. Test Your Connection

Run the connection test:

```bash
cd backend
node test-db.js
```

You should see:
```
✅ MongoDB Connection: SUCCESS
🌐 Connected to: khetsetu-cluster-shard-00-02.xxxxx.mongodb.net
```

### 8. Start Your Backend

```bash
npm run dev
```

You should see:
```
🌾 KhetSetu API Server running on port 5000
📖 API Documentation available at http://localhost:5000/api/docs
```

## Connection String Breakdown

```
mongodb+srv://khetsetu:password@cluster.mongodb.net/khetsetu?retryWrites=true&w=majority
           |       |         |                  |
           |       |         |                  └── Database name
           |       |         └── Cluster hostname
           |       └── Password
           └── Username
```

## Security Best Practices

### For Development:
- ✅ Use `0.0.0.0/0` for IP whitelist
- ✅ Use environment variables for credentials
- ✅ Never commit `.env` files to git

### For Production:
- ✅ Whitelist only your server's IP addresses
- ✅ Use strong passwords
- ✅ Enable MongoDB Atlas security features
- ✅ Use separate databases for dev/staging/production

## Troubleshooting

### Connection Issues

**Error: `Authentication failed`**
- Check username and password in connection string
- Verify user exists in Database Access
- Check user permissions

**Error: `Connection timeout`**
- Check Network Access settings
- Verify IP whitelist includes your IP
- Check firewall settings

**Error: `Server selection timed out`**
- Check internet connection
- Verify cluster is running
- Check connection string format

### Common Mistakes

1. **Wrong password**: Copy-paste the exact password from Atlas
2. **Missing database name**: Add `/khetsetu` before the query parameters
3. **IP not whitelisted**: Check Network Access settings
4. **Cluster not ready**: Wait for cluster creation to complete

## Sample Data

Once connected, you can add sample data through your API endpoints:

1. **Create a user**: `POST /api/auth/register`
2. **Create a farm**: `POST /api/farms`
3. **Add crops**: `POST /api/crops`

## MongoDB Compass (Optional)

For a GUI database client:

1. Download [MongoDB Compass](https://www.mongodb.com/products/compass)
2. Use the same connection string
3. Browse and manage your data visually

## Alternative: Local MongoDB

If you prefer local development:

```bash
# Ubuntu/Zorin OS
sudo apt-get update
sudo apt-get install -y mongodb-org
sudo systemctl start mongod
sudo systemctl enable mongod

# Use local connection string
MONGODB_URI=mongodb://localhost:27017/khetsetu
```

## Next Steps

After MongoDB is set up:

1. ✅ Test all API endpoints
2. ✅ Set up data validation
3. ✅ Configure indexes for performance
4. ✅ Set up database monitoring
5. ✅ Plan backup strategy

## Support

- 📖 [MongoDB Atlas Documentation](https://docs.atlas.mongodb.com/)
- 💬 [MongoDB Community Forums](https://community.mongodb.com/)
- 🎓 [MongoDB University](https://university.mongodb.com/)

---

**Happy coding! 🌾**