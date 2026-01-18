# Railway Deployment (30-day free trial)

**Frontend**: Vercel (Free forever)
**Backend**: Railway (Free for 30 days) - `https://web-production-df2e0.up.railway.app`
**Database**: Add PostgreSQL on Railway OR use Supabase

## Setup Steps

### 1. Railway Backend
- Your backend is already deployed
- URL: `https://web-production-df2e0.up.railway.app`

### 2. Add Database (Choose One)

**Option A: Railway PostgreSQL**
1. Go to Railway Dashboard → Your project
2. Click "New" → "Database" → "PostgreSQL"
3. Railway auto-links the `DATABASE_URL` to your backend
4. Done!

**Option B: Supabase (Permanent Free)**
1. Go to Railway → Your backend → Variables
2. Add: `DATABASE_URL` = `postgresql://postgres:Sanjay@9492834094@db.xtrunmzhzucapatradse.supabase.co:5432/postgres`
3. Deploy

### 3. Deploy Frontend
- Code already pushed to GitHub
- Vercel will auto-deploy
- Frontend connects to Railway backend automatically

## After 30 Days
You'll need to migrate to a permanent free solution like:
- Render.com (free forever)
- Fly.io (free tier)
- Or keep paying Railway ($5/month)
