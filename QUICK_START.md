# Quick Start Guide - CBT Platform

## Prerequisites Setup

### 1. Install MongoDB (Choose one option):

**Option A: MongoDB Community Server (Local)**
1. Download from: https://www.mongodb.com/try/download/community
2. Install and start MongoDB service
3. MongoDB will run on `mongodb://localhost:27017`

**Option B: MongoDB Atlas (Cloud - Recommended)**
1. Create free account at: https://cloud.mongodb.com
2. Create new cluster
3. Get connection string and update `.env` file

### 2. Environment Setup
Ensure your `server/.env` file contains:
```env
NODE_ENV=development
PORT=5000
MONGODB_URI=mongodb://localhost:27017/cbt-platform
JWT_SECRET=cbt_platform_super_secret_jwt_key_2025_development
CLIENT_URL=http://localhost:3000
```

## Local Development

### 1. Start MongoDB (if using local installation)
```bash
# Windows (if installed as service, it should start automatically)
# Or manually: mongod

# macOS/Linux
mongod
```

### 2. Initialize Database
```bash
cd server
npm run seed
```
This creates:
- Default admin user (ID: `ADMIN001`, Password: `AdminPassword123!`)
- Sample courses

### 3. Start Backend Server
```bash
cd server
npm run dev
```
Server will run on: http://localhost:5000

### 4. Start Frontend Client
```bash
cd client
npm start
```
Client will run on: http://localhost:3000

## Testing the Platform

### Test Admin Portal:
1. Go to: http://localhost:3000
2. Click "Admin Login"
3. Login with:
   - **Admin ID:** `ADMIN001`
   - **Password:** `AdminPassword123!`
4. Explore admin dashboard and features

### Test Student Portal:
1. Go to: http://localhost:3000
2. Click "New Student? Register"
3. Register a new student account
4. Login and explore student dashboard

## Deployment to Production

### Frontend (Vercel):
1. Push code to GitHub
2. Connect GitHub repo to Vercel
3. Deploy from `client/` directory
4. Set environment variable: `REACT_APP_API_URL` to your backend URL

### Backend (Render):
1. Push code to GitHub
2. Connect GitHub repo to Render
3. Use the provided `render.yaml` configuration
4. Set environment variables in Render dashboard

## Default Credentials

**Admin Access:**
- Admin ID: `ADMIN001`
- Password: `AdminPassword123!`

**Student Access:**
- Create new account through registration

## Features Available

✅ **Completed:**
- Separate admin and student portals
- User authentication and registration
- Responsive UI design
- Database models and API endpoints
- Deployment configuration

🚧 **In Development:**
- Complete test-taking functionality
- Question management interface
- Results analytics and export
- Advanced course management

## Troubleshooting

**Database Connection Issues:**
- Ensure MongoDB is running
- Check connection string in `.env` file
- For Atlas: Whitelist your IP address

**Port Conflicts:**
- Backend default: Port 5000
- Frontend default: Port 3000
- Change in respective package.json if needed

**Build Issues:**
- Clear node_modules and package-lock.json
- Run `npm install` again
- Check Node.js version (14+ required)

## Support

For issues and questions:
1. Check the main README.md
2. Review error logs in console
3. Ensure all dependencies are installed
4. Verify environment variables are set correctly

---

**Ready to build an amazing CBT platform! 🚀**