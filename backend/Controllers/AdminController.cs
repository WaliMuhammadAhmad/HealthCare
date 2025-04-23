using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace backend.Controllers
{
    [ApiController]
[Route("api/[controller]")]
public class AdminController : ControllerBase
{
    private readonly HealthCareDbContext _context;
    private readonly IConfiguration _config;

    public AdminController(HealthCareDbContext context, IConfiguration config)
    {
        _context = context;
        _config = config;
    }

        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] LoginRequest request)
        {
            if (string.IsNullOrWhiteSpace(request.Password))
                return BadRequest(new { message = "Password cannot be null or empty." });

            var hashedPassword = AuthHelper.HashPassword(request.Password);

            var admin = await _context.Admins
                .FirstOrDefaultAsync(a => a.Email == request.Email && a.Password == hashedPassword);

            if (admin == null)
                return Unauthorized(new { message = "Invalid email or password." });

            // Create JWT
            var token = AuthHelper.GenerateJwtToken(admin.AdminID.ToString(), admin.Email, "Admin", _config);

            return Ok(new
            {
                message = "Login successful.",
                token,
                admin.AdminID,
                admin.Name,
                admin.Username,
                admin.Email,
                admin.ProfilePic
            });
        }

        [HttpGet("me")]
        public async Task<IActionResult> GetAdminProfile()
        {
            var token = Request.Cookies["admin_token"];
            if (string.IsNullOrEmpty(token))
                return Unauthorized("Missing token"); 

            var adminId = AuthHelper.GetUserIdFromToken(token, "Admin", _config);
            if (adminId == null)
                return Unauthorized("Invalid token");

            var admin = await _context.Admins
                .Where(a => a.AdminID == adminId)
                .Select(a => new
                {
                    a.AdminID,
                    a.Name,
                    a.Username,
                    a.Email,
                    a.ProfilePic,
                })
                .FirstOrDefaultAsync();

            if (admin == null)
                return NotFound("Admin not found");

            return Ok(admin);
        }
        
        // GET: api/Admin
        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            var admins = await _context.Admins.ToListAsync();
            return Ok(admins);
        }

        // GET: api/Admin/1
        [HttpGet("{id}")]
        public async Task<IActionResult> Get(int id)
        {
            var admin = await _context.Admins.FindAsync(id);
            if (admin == null)
                return NotFound(new { message = "Admin not found." });

            return Ok(admin);
        }

        // POST: api/Admin
        [HttpPost]
        public async Task<IActionResult> Create([FromBody] Admin admin)
        {
            admin.Password = AuthHelper.HashPassword(admin.Password);
            admin.CreatedAt = DateTime.UtcNow;
            admin.UpdatedAt = DateTime.UtcNow;

            _context.Admins.Add(admin);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(Get), new { id = admin.AdminID }, admin);
        }

        // PUT: api/Admin/1
        [HttpPut("{id}")]
        public async Task<IActionResult> Update(int id, [FromBody] EditAdminInfoDto updatedAdmin)
        {
            var admin = await _context.Admins.FindAsync(id);
            if (admin == null)
                return NotFound(new { message = "Admin not found." });

            admin.Name = updatedAdmin.Name;
            admin.Username = updatedAdmin.Username;
            admin.Email = updatedAdmin.Email;
            admin.ProfilePic = updatedAdmin.ProfilePic;
            admin.UpdatedAt = DateTime.UtcNow;

            await _context.SaveChangesAsync();
            return Ok(new { message = "Admin updated successfully." });
        }

        // DELETE: api/Admin/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            var admin = await _context.Admins.FindAsync(id);
            if (admin == null)
                return NotFound(new { message = "Admin not found." });

            _context.Admins.Remove(admin);
            await _context.SaveChangesAsync();

            return Ok(new { message = "Admin deleted successfully." });
        }

        // PATCH: api/Admin/update-password/1
        [HttpPatch("update-password/{id}")]
        public async Task<IActionResult> UpdatePassword(int id, [FromBody] PasswordUpdateRequest request)
        {
            var admin = await _context.Admins.FindAsync(id);
            if (admin == null)
                return NotFound(new { message = "Admin not found." });

            if (string.IsNullOrEmpty(request.OldPassword))
                return BadRequest(new { message = "Old password cannot be null or empty." });

            if (string.IsNullOrEmpty(request.NewPassword))
                return BadRequest(new { message = "New password cannot be null or empty." });

            var hashedPassword = AuthHelper.HashPassword(request.OldPassword);

            if (admin.Password != hashedPassword)
                return Unauthorized(new { message = "Old password is incorrect." });

            admin.Password = AuthHelper.HashPassword(request.NewPassword);
            admin.UpdatedAt = DateTime.UtcNow;

            await _context.SaveChangesAsync();
            return Ok(new { message = "Password updated successfully." });
        }
    }
}
