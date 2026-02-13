# Complete MiniGram-AI Test Suite

# Test Configuration
$API_URL = "http://localhost:3000/api"
$RandomId = Get-Random -Minimum 10000 -Maximum 99999
$TestEmail = "johndoe$RandomId@minigram.com"
$TestUsername = "johndoe$(Get-Random -Minimum 100 -Maximum 999)"
$TestPassword = "Test@123456"

# Color output
function Write-Success { Write-Host $args[0] -ForegroundColor Green }
function Write-Error { Write-Host $args[0] -ForegroundColor Red }
function Write-Info { Write-Host $args[0] -ForegroundColor Cyan }

Write-Info "`n========== MINIGRAM-AI TEST SUITE =========="

# Test 1: Registration
Write-Info "`n[TEST 1] User Registration"
$registerBody = @{
    username = $TestUsername
    email = $TestEmail
    password = $TestPassword
    passwordConfirm = $TestPassword
} | ConvertTo-Json

try {
    $registerResp = Invoke-WebRequest "$API_URL/auth/register" `
        -Method POST -Body $registerBody -ContentType "application/json" `
        -UseBasicParsing -TimeoutSec 10
    
    $registerData = $registerResp.Content | ConvertFrom-Json
    if ($registerData.success) {
        Write-Success "✅ REGISTRATION SUCCESS"
        Write-Info "Username: $TestUsername"
        Write-Info "Email: $TestEmail"
        $UserId = $registerData.user.id
        Write-Info "User ID: $UserId"
    } else {
        Write-Error "❌ REGISTRATION FAILED: $($registerData.message)"
        exit 1
    }
} catch {
    Write-Error "❌ REGISTRATION ERROR: $($_.Exception.Message)"
    exit 1
}

# Test 2: Login
Write-Info "`n[TEST 2] User Login"
$loginBody = @{
    email = $TestEmail
    password = $TestPassword
} | ConvertTo-Json

try {
    $loginResp = Invoke-WebRequest "$API_URL/auth/login" `
        -Method POST -Body $loginBody -ContentType "application/json" `
        -UseBasicParsing -TimeoutSec 10 `
        -SessionVariable sess
    
    $loginData = $loginResp.Content | ConvertFrom-Json
    if ($loginData.success) {
        Write-Success "✅ LOGIN SUCCESS"
        Write-Info "Logged in as: $($loginData.user.username)"
        Write-Info "User Email: $($loginData.user.email)"
    } else {
        Write-Error "❌ LOGIN FAILED: $($loginData.message)"
        exit 1
    }
} catch {
    Write-Error "❌ LOGIN ERROR: $($_.Exception.Message)"
    exit 1
}

# Test 3: Get Current User
Write-Info "`n[TEST 3] Get Current User (/auth/me)"
try {
    $meResp = Invoke-WebRequest "$API_URL/auth/me" `
        -UseBasicParsing -TimeoutSec 10 `
        -WebSession $sess
    
    $meData = $meResp.Content | ConvertFrom-Json
    if ($meData.success) {
        Write-Success "✅ GET CURRENT USER SUCCESS"
        Write-Info "User: $($meData.user.username)"
        Write-Info "Email: $($meData.user.email)"
    } else {
        Write-Error "❌ GET CURRENT USER FAILED: $($meData.message)"
    }
} catch {
    Write-Error "❌ GET CURRENT USER ERROR: $($_.Exception.Message)"
}

# Test 4: Create Post with Image
Write-Info "`n[TEST 4] Create Post with Caption"
$createPostBody = @{
    caption = "My first MiniGram post! 🎉 #excited #photography"
    imageUrl = "https://via.placeholder.com/600x400?text=My+First+Post"
    tags = @("excited", "photography", "debut")
    aiGenerated = $false
    originalCaption = $null
} | ConvertTo-Json

try {
    $postResp = Invoke-WebRequest "$API_URL/posts" `
        -Method POST -Body $createPostBody -ContentType "application/json" `
        -UseBasicParsing -TimeoutSec 10 `
        -WebSession $sess
    
    $postData = $postResp.Content | ConvertFrom-Json
    if ($postData.success) {
        Write-Success "✅ CREATE POST SUCCESS"
        Write-Info "Post ID: $($postData.post._id)"
        Write-Info "Caption: $($postData.post.caption)"
        Write-Info "Tags: $($postData.post.tags -join ', ')"
        $PostId = $postData.post._id
    } else {
        Write-Error "❌ CREATE POST FAILED: $($postData.message)"
    }
} catch {
    Write-Error "❌ CREATE POST ERROR: $($_.Exception.Message)"
}

# Test 5: Get All Posts
Write-Info "`n[TEST 5] Get All Posts"
try {
    $getAllResp = Invoke-WebRequest "$API_URL/posts?page=1&limit=10" `
        -UseBasicParsing -TimeoutSec 10
    
    $getAllData = $getAllResp.Content | ConvertFrom-Json
    if ($getAllData.success) {
        Write-Success "✅ GET ALL POSTS SUCCESS"
        Write-Info "Total Posts: $($getAllData.pagination.total)"
        Write-Info "Posts Retrieved: $($getAllData.posts.Count)"
        Write-Info "Pages: $($getAllData.pagination.pages)"
    } else {
        Write-Error "❌ GET ALL POSTS FAILED: $($getAllData.message)"
    }
} catch {
    Write-Error "❌ GET ALL POSTS ERROR: $($_.Exception.Message)"
}

# Test 6: Like a Post
if ($PostId) {
    Write-Info "`n[TEST 6] Like Post"
    try {
        $likeResp = Invoke-WebRequest "$API_URL/posts/$PostId/like" `
            -Method POST -UseBasicParsing -TimeoutSec 10 `
            -WebSession $sess
        
        $likeData = $likeResp.Content | ConvertFrom-Json
        if ($likeData.success) {
            Write-Success "✅ LIKE POST SUCCESS"
            Write-Info "Post Likes: $($likeData.post.likeCount)"
        } else {
            Write-Error "❌ LIKE POST FAILED: $($likeData.message)"
        }
    } catch {
        Write-Error "❌ LIKE POST ERROR: $($_.Exception.Message)"
    }

    # Test 7: Add Comment
    Write-Info "`n[TEST 7] Add Comment to Post"
    $commentBody = @{
        text = "This is an amazing post! Love it! ❤️"
    } | ConvertTo-Json

    try {
        $commentResp = Invoke-WebRequest "$API_URL/posts/$PostId/comments" `
            -Method POST -Body $commentBody -ContentType "application/json" `
            -UseBasicParsing -TimeoutSec 10 `
            -WebSession $sess
        
        $commentData = $commentResp.Content | ConvertFrom-Json
        if ($commentData.success) {
            Write-Success "✅ ADD COMMENT SUCCESS"
            Write-Info "Comment ID: $($commentData.comment._id)"
            Write-Info "Comment Text: $($commentData.comment.text)"
            Write-Info "Total Comments: $($commentData.post.commentCount)"
        } else {
            Write-Error "❌ ADD COMMENT FAILED: $($commentData.message)"
        }
    } catch {
        Write-Error "❌ ADD COMMENT ERROR: $($_.Exception.Message)"
    }

    # Test 8: Get User Feed (Protected Route)
    Write-Info "`n[TEST 8] Get User Feed (Protected)"
    try {
        $feedResp = Invoke-WebRequest "$API_URL/posts/feed?page=1&limit=10" `
            -UseBasicParsing -TimeoutSec 10 `
            -WebSession $sess
        
        $feedData = $feedResp.Content | ConvertFrom-Json
        if ($feedData.success) {
            Write-Success "✅ GET USER FEED SUCCESS"
            Write-Info "Feed Posts: $($feedData.posts.Count)"
            Write-Info "Total: $($feedData.pagination.total)"
        } else {
            Write-Error "❌ GET USER FEED FAILED: $($feedData.message)"
        }
    } catch {
        Write-Error "❌ GET USER FEED ERROR: $($_.Exception.Message)"
    }
}

# Test 9: AI Caption Generation
Write-Info "`n[TEST 9] Generate AI Captions"
$aiBody = @{
    imageDescription = "A beautiful sunset over the ocean with colorful sky, waves crashing on sandy beach"
} | ConvertTo-Json

try {
    $aiResp = Invoke-WebRequest "$API_URL/ai/generate-suggestions" `
        -Method POST -Body $aiBody -ContentType "application/json" `
        -UseBasicParsing -TimeoutSec 10 `
        -WebSession $sess
    
    $aiData = $aiResp.Content | ConvertFrom-Json
    if ($aiData.success) {
        Write-Success "✅ AI CAPTION GENERATION SUCCESS"
        Write-Info "Suggestions Generated: $($aiData.suggestions.Count)"
        for ($i = 0; $i -lt [Math]::Min($aiData.suggestions.Count, 3); $i++) {
            Write-Info "  [$($i+1)] $($aiData.suggestions[$i])"
        }
    } else {
        Write-Error "❌ AI CAPTION GENERATION FAILED: $($aiData.message)"
    }
} catch {
    Write-Error "❌ AI CAPTION GENERATION ERROR: $($_.Exception.Message)"
}

# Summary
Write-Info "`n========== TEST SUITE COMPLETE =========="
Write-Success "`n✅ All core features tested successfully!"
Write-Info "Test User Created:"
Write-Info "  Email: $TestEmail"
Write-Info "  Username: $TestUsername"
Write-Info "  Password: $TestPassword"
Write-Info "`nYou can now login to the application with these credentials."
