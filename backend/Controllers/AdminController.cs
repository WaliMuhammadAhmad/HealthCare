using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Security.Cryptography;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using Microsoft.IdentityModel.Tokens;
using System.Text;

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
        public async Task<IActionResult> Update(int id, [FromBody] Admin updatedAdmin)
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

            if (string.IsNullOrEmpty(request.NewPassword))
                return BadRequest(new { message = "New password cannot be null or empty." });

            admin.Password = AuthHelper.HashPassword(request.NewPassword);
            admin.UpdatedAt = DateTime.UtcNow;

            await _context.SaveChangesAsync();
            return Ok(new { message = "Password updated successfully." });
        }
    }

    // --- Request Models ---
    public class LoginRequest
    {
        public string? Email { get; set; }
        public string? Password { get; set; }
    }

    public class PasswordUpdateRequest
    {
        public string? NewPassword { get; set; }
    }
}
