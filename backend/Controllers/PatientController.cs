using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Globalization;

namespace backend.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class PatientController : ControllerBase
    {
        private readonly HealthCareDbContext _context;
        private readonly IConfiguration _config;

        public PatientController(HealthCareDbContext context, IConfiguration config)
        {
            _context = context;
            _config = config;
        }

        // GET: api/Patient
        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            var patients = await _context.Patients.ToListAsync();
            return Ok(patients);
        }

        // GET: api/Patient/1
        [HttpGet("{id}")]
        public async Task<IActionResult> Get(int id)
        {
            var patient = await _context.Patients.FindAsync(id);
            if (patient == null)
                return NotFound(new { message = "Patient not found." });

            return Ok(patient);
        }

        // POST: api/Patient/login
        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] LoginRequest request)
        {
            if (string.IsNullOrWhiteSpace(request.Password))
                return BadRequest(new { message = "Password cannot be null or empty." });

            if (string.IsNullOrWhiteSpace(request.Email))
                return BadRequest(new { message = "Email cannot be null or empty." });

            var hashedPassword = AuthHelper.HashPassword(request.Password);

            var patient = await _context.Patients
                .FirstOrDefaultAsync(a => a.Email == request.Email && a.Password == hashedPassword);

            if(patient != null && patient.AccountStatus == "Deactivated")
                return Unauthorized(new { message = "Your account is inactive. Please contact support." });

            if (patient == null)
                return Unauthorized(new { message = "Invalid email or password." });

            // Create JWT
            var token = AuthHelper.GenerateJwtToken(patient.PatientID.ToString(), patient.Email, "Patient", _config);

            return Ok(new
            {
                message = "Login successful.",
                token,
                patient.PatientID,
                patient.FullName,
                patient.Username,
                patient.Email,
                patient.ProfilePic,
                patient.PhoneNumber,
                patient.DateOfBirth,
                patient.Gender,
                patient.Address,
                patient.EmergencyContactName,
                patient.EmergencyContact,
                patient.AccountStatus,
                patient.CreatedAt,
                patient.UpdatedAt,
            });
        }

        // GET: api/Patient/me
        [HttpGet("me")]
        public async Task<IActionResult> GetPatientProfile()
        {
            var token = Request.Cookies["patient_token"];
            if (string.IsNullOrEmpty(token))
                return Unauthorized("Missing token"); 

            var patientId = AuthHelper.GetUserIdFromToken(token, "Patient", _config);
            if (patientId == null)
                return Unauthorized("Invalid token");

            var patient = await _context.Patients
                .Where(a => a.PatientID == patientId)
                .Select(a => new
                {
                    a.PatientID,
                    a.FullName,
                    a.Username,
                    a.Email,
                    a.ProfilePic,
                    a.PhoneNumber,
                    a.DateOfBirth,
                    a.Gender,
                    a.Address,
                    a.EmergencyContactName,
                    a.EmergencyContact,
                    a.AccountStatus,
                    a.CreatedAt,
                    a.UpdatedAt,
                })
                .FirstOrDefaultAsync();

            if (patient == null)
                return NotFound("Admin not found");

            return Ok(patient);
        }
    
        // POST: api/Patient
        [HttpPost]
        public async Task<IActionResult> Create([FromBody] Patient patient)
        {
            patient.Password = AuthHelper.HashPassword(patient.Password);
            patient.CreatedAt = DateTime.UtcNow;
            patient.UpdatedAt = DateTime.UtcNow;

            _context.Patients.Add(patient);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(Get), new { id = patient.PatientID }, patient);
        }

        // PUT: api/Patient/1
        [HttpPut("{id}")]
        public async Task<IActionResult> Update(int id, [FromBody] UpdatePatientInfo updatedPatient)
        {
            var patient = await _context.Patients.FindAsync(id);
            if (patient == null)
                return NotFound(new { message = "Patient not found." });

            patient.FullName = updatedPatient.FullName ?? patient.FullName;
            patient.Email = updatedPatient.Email ?? patient.Email;
            patient.ProfilePic = updatedPatient.ProfilePic;
            patient.PhoneNumber = updatedPatient.PhoneNumber;
            patient.DateOfBirth = updatedPatient.DateOfBirth;
            patient.Gender = updatedPatient.Gender;
            patient.Address = updatedPatient.Address;
            patient.EmergencyContactName = updatedPatient.EmergencyContactName;
            patient.EmergencyContact = updatedPatient.EmergencyContact;
            patient.UpdatedAt = DateTime.UtcNow;

            await _context.SaveChangesAsync();
            return Ok(new { message = "Patient updated successfully." });
        }

        // DELETE: api/Patient/1
        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            var patient = await _context.Patients.FindAsync(id);
            if (patient == null)
                return NotFound(new { message = "Patient not found." });

            _context.Patients.Remove(patient);
            await _context.SaveChangesAsync();

            return Ok(new { message = "Patient deleted successfully." });
        }

        // PATCH: api/Patient/account-status/1
        [HttpPatch("account-status/{id}")]
        public async Task<IActionResult> UpdateAccountStatus(int id, [FromBody] UpdatePatientAccountStatusDto request)
        {
            var patient = await _context.Patients.FindAsync(id);
            if (patient == null)
                return NotFound(new { message = "Patient not found." });

            if (string.IsNullOrEmpty(request.AccountStatus))
                return BadRequest(new { message = "Account Status cannot be empty." });

            patient.AccountStatus = request.AccountStatus;
            patient.UpdatedAt = DateTime.UtcNow;
            await _context.SaveChangesAsync();

            return Ok(new { message = "Account status updated successfully." });
        }

        // PATCH: api/Patient/profile-pic/1
        [HttpPatch("profile-pic/{id}")]
        public async Task<IActionResult> UpdateProfilePic(int id, [FromBody] Patient request)
        {
            var patient = await _context.Patients.FindAsync(id);
            if (patient == null)
                return NotFound(new { message = "Patient not found." });

            patient.ProfilePic = request.ProfilePic;
            patient.UpdatedAt = DateTime.UtcNow;
            await _context.SaveChangesAsync();

            return Ok(new { message = "Profile picture updated successfully." });
        }

        // PATCH: api/Patient/phone-number/1
        [HttpPatch("phone-number/{id}")]
        public async Task<IActionResult> UpdatePhoneNumber(int id, [FromBody] Patient request)
        {
            var patient = await _context.Patients.FindAsync(id);
            if (patient == null)
                return NotFound(new { message = "Patient not found." });

            patient.PhoneNumber = request.PhoneNumber;
            patient.UpdatedAt = DateTime.UtcNow;
            await _context.SaveChangesAsync();

            return Ok(new { message = "Phone number updated successfully." });
        }

        // PATCH: api/Patient/address/1
        [HttpPatch("address/{id}")]
        public async Task<IActionResult> UpdateAddress(int id, [FromBody] Patient request)
        {
            var patient = await _context.Patients.FindAsync(id);
            if (patient == null)
                return NotFound(new { message = "Patient not found." });

            patient.Address = request.Address;
            patient.UpdatedAt = DateTime.UtcNow;
            await _context.SaveChangesAsync();

            return Ok(new { message = "Address updated successfully." });
        }

        // PATCH: api/Patient/emergency-contact/1
        [HttpPatch("emergency-contact/{id}")]
        public async Task<IActionResult> UpdateEmergencyContact(int id, [FromBody] Patient request)
        {
            var patient = await _context.Patients.FindAsync(id);
            if (patient == null)
                return NotFound(new { message = "Patient not found." });

            patient.EmergencyContactName = request.EmergencyContactName;
            patient.EmergencyContact = request.EmergencyContact;
            patient.UpdatedAt = DateTime.UtcNow;
            await _context.SaveChangesAsync();

            return Ok(new { message = "Emergency contact updated successfully." });
        }

        // PATCH: api/Patient/gender/1
        [HttpPatch("gender/{id}")]
        public async Task<IActionResult> UpdateGender(int id, [FromBody] Patient request)
        {
            var patient = await _context.Patients.FindAsync(id);
            if (patient == null)
                return NotFound(new { message = "Patient not found." });

            patient.Gender = request.Gender;
            patient.UpdatedAt = DateTime.UtcNow;
            await _context.SaveChangesAsync();

            return Ok(new { message = "Gender updated successfully." });
        }

        // PATCH: api/Patient/date-of-birth/1
        [HttpPatch("date-of-birth/{id}")]
        public async Task<IActionResult> UpdateDateOfBirth(int id, [FromBody] Patient request)
        {
            var patient = await _context.Patients.FindAsync(id);
            if (patient == null)
                return NotFound(new { message = "Patient not found." });

            patient.DateOfBirth = request.DateOfBirth;
            patient.UpdatedAt = DateTime.UtcNow;
            await _context.SaveChangesAsync();

            return Ok(new { message = "Date of Birth updated successfully." });
        }

        // PATCH: api/Patient/update-password/1
        [HttpPatch("update-password/{id}")]
        public async Task<IActionResult> UpdatePassword(int id, [FromBody] PasswordUpdateRequest request)
        {
            var patient = await _context.Patients.FindAsync(id);
            if (patient == null)
                return NotFound(new { message = "Patient not found." });

            if (string.IsNullOrEmpty(request.OldPassword))
                return BadRequest(new { message = "Old password cannot be null or empty." });

            if (string.IsNullOrEmpty(request.NewPassword))
                return BadRequest(new { message = "New password cannot be null or empty." });

            var hashedPassword = AuthHelper.HashPassword(request.OldPassword);

            if (patient.Password != hashedPassword)
                return Unauthorized(new { message = "Old password is incorrect." });

            patient.Password = AuthHelper.HashPassword(request.NewPassword);
            patient.UpdatedAt = DateTime.UtcNow;

            await _context.SaveChangesAsync();
            return Ok(new { message = "Password updated successfully." });
        }
    
        // GET: api/Patient/latest-users
        [HttpGet("latest-users")]
        public async Task<IActionResult> GetLatestUsers()
        {
            var users = await _context.Patients
                .OrderByDescending(u => u.CreatedAt)
                .Take(5)
                .Select(u => new
                {
                    id = u.PatientID,
                    name = u.FullName,
                    email = u.Email,
                    image = u.ProfilePic,
                    joinedDate = u.CreatedAt
                })
                .ToListAsync();

            return Ok(users);
        }    
    
        // GET: api/Patient/users/monthly
        [HttpGet("users/monthly")]
        public async Task<IActionResult> GetMonthlyUsers()
        {
            var currentYear = DateTime.UtcNow.Year;

            var patientData = await _context.Patients
                .Where(p => p.CreatedAt.Year == currentYear)
                .GroupBy(p => p.CreatedAt.Month)
                .Select(g => new { Month = g.Key, Count = g.Count() })
                .ToListAsync();

            var doctorData = await _context.Doctors
                .Where(d => d.CreatedAt.Year == currentYear)
                .GroupBy(d => d.CreatedAt.Month)
                .Select(g => new { Month = g.Key, Count = g.Count() })
                .ToListAsync();

            var combined = Enumerable.Range(1, 12)
                .Select(month =>
                {
                    var patientCount = patientData.FirstOrDefault(p => p.Month == month)?.Count ?? 0;
                    var doctorCount = doctorData.FirstOrDefault(d => d.Month == month)?.Count ?? 0;

                    return new
                    {
                        month = CultureInfo.CurrentCulture.DateTimeFormat.GetAbbreviatedMonthName(month),
                        users = patientCount + doctorCount
                    };
                });

            return Ok(combined);
        }
    }
}
