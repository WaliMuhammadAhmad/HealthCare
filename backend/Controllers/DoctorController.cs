using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using backend.Dtos;

namespace backend.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class DoctorController : ControllerBase
    {
        private readonly HealthCareDbContext _context;

        public DoctorController(HealthCareDbContext context)
        {
            _context = context;
        }

        // GET: api/Doctor
        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            var doctors = await _context.Doctors.ToListAsync();
            return Ok(doctors);
        }

        // GET: api/Doctor/1
        [HttpGet("{id}")]
        public async Task<IActionResult> Get(int id)
        {
            var doctor = await _context.Doctors.FindAsync(id);
            if (doctor == null)
                return NotFound(new { message = "Doctor not found." });

            return Ok(doctor);
        }

        // POST: api/Doctor
        [HttpPost]
        public async Task<IActionResult> Create([FromBody] Doctor doctor)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            if (await _context.Doctors.AnyAsync(d => d.Email == doctor.Email))
                return Conflict(new { message = "Email already exists." });

            doctor.CreatedAt = DateTime.UtcNow;
            doctor.UpdatedAt = DateTime.UtcNow;

            _context.Doctors.Add(doctor);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(Get), new { id = doctor.DoctorID }, doctor);
        }

        // PUT: api/Doctor/1
        [HttpPut("{id}")]
        public async Task<IActionResult> Update(int id, [FromBody] Doctor updatedDoctor)
        {
            var doctor = await _context.Doctors.FindAsync(id);
            if (doctor == null)
                return NotFound(new { message = "Doctor not found." });

            doctor.FullName = updatedDoctor.FullName;
            doctor.Email = updatedDoctor.Email;
            doctor.Specialty = updatedDoctor.Specialty;
            doctor.Status = updatedDoctor.Status;
            doctor.ServiceDays = updatedDoctor.ServiceDays;
            doctor.AvailabilityTimes = updatedDoctor.AvailabilityTimes;
            doctor.Bio = updatedDoctor.Bio;
            doctor.UpdatedAt = DateTime.UtcNow;

            await _context.SaveChangesAsync();
            return Ok(doctor);
        }

        // PATCH: api/Doctor/bio/1
        [HttpPatch("bio/{id}")]
        public async Task<IActionResult> UpdateBio(int id, [FromBody] UpdateBioDto dto)
        {
            var doctor = await _context.Doctors.FindAsync(id);
            if (doctor == null)
                return NotFound(new { message = "Doctor not found." });

            if (string.IsNullOrWhiteSpace(dto.Bio))
                return BadRequest(new { message = "Bio cannot be null or empty." });

            doctor.Bio = dto.Bio;
            doctor.UpdatedAt = DateTime.UtcNow;

            await _context.SaveChangesAsync();
            return Ok(new { message = "Bio updated successfully.", bio = doctor.Bio });
        }

        // PATCH: api/Doctor/service-days/1
        [HttpPatch("service-days/{id}")]
        public async Task<IActionResult> UpdateServiceDays(int id, [FromBody] UpdateServiceDaysDto dto)
        {
            var doctor = await _context.Doctors.FindAsync(id);
            if (doctor == null)
                return NotFound(new { message = "Doctor not found." });

            if (string.IsNullOrWhiteSpace(dto.ServiceDays))
                return BadRequest(new { message = "Service Days cannot be null or empty." });

            doctor.ServiceDays = dto.ServiceDays;
            doctor.UpdatedAt = DateTime.UtcNow;

            await _context.SaveChangesAsync();
            return Ok(new { message = "Service Days updated successfully.", serviceDays = doctor.ServiceDays });
        }

        // PATCH: api/Doctor/status/1
        [HttpPatch("status/{id}")]
        public async Task<IActionResult> UpdateStatus(int id, [FromBody] UpdateStatusDto dto)
        {
            var doctor = await _context.Doctors.FindAsync(id);
            if (doctor == null)
                return NotFound(new { message = "Doctor not found." });

            if (string.IsNullOrWhiteSpace(dto.Status))
                return BadRequest(new { message = "Status cannot be null or empty." });

            doctor.Status = dto.Status;
            doctor.UpdatedAt = DateTime.UtcNow;

            await _context.SaveChangesAsync();
            return Ok(new { message = "Status updated successfully.", status = doctor.Status });
        }

        // PATCH: api/Doctor/specialty/1
        [HttpPatch("specialty/{id}")]
        public async Task<IActionResult> UpdateSpecialty(int id, [FromBody] UpdateSpecialtyDto dto)
        {
            var doctor = await _context.Doctors.FindAsync(id);
            if (doctor == null)
                return NotFound(new { message = "Doctor not found." });

            if (string.IsNullOrWhiteSpace(dto.Specialty))
                return BadRequest(new { message = "Specialty cannot be null or empty." });

            doctor.Specialty = dto.Specialty;
            doctor.UpdatedAt = DateTime.UtcNow;

            await _context.SaveChangesAsync();
            return Ok(new { message = "Specialty updated successfully.", specialty = doctor.Specialty });
        }

        // PATCH: api/Doctor/availability-times/1
        [HttpPatch("availability-times/{id}")]
        public async Task<IActionResult> UpdateAvailabilityTimes(int id, [FromBody] UpdateAvailabilityDto dto)
        {
            var doctor = await _context.Doctors.FindAsync(id);
            if (doctor == null)
                return NotFound(new { message = "Doctor not found." });

            if (string.IsNullOrWhiteSpace(dto.AvailabilityTimes))
                return BadRequest(new { message = "Availability Times cannot be null or empty." });

            doctor.AvailabilityTimes = dto.AvailabilityTimes;
            doctor.UpdatedAt = DateTime.UtcNow;

            await _context.SaveChangesAsync();
            return Ok(new { message = "Availability Times updated successfully.", availability = doctor.AvailabilityTimes });
        }

        // DELETE: api/Doctor/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            var doctor = await _context.Doctors.FindAsync(id);
            if (doctor == null)
                return NotFound(new { message = "Doctor not found." });

            _context.Doctors.Remove(doctor);
            await _context.SaveChangesAsync();

            return Ok(new { message = "Doctor deleted successfully." });
        }
    }
}
