using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using HealthCareAPI.DTOs;

namespace backend.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AppointmentController : ControllerBase
    {
        private readonly HealthCareDbContext _context;

        public AppointmentController(HealthCareDbContext context)
        {
            _context = context;
        }

        // GET: api/Appointment
        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            var appointments = await _context.Appointments
                .Include(a => a.Patient)
                .Include(a => a.Doctor)
                .ToListAsync();

            var result = appointments.Select(a => new AppointmentResponseDto
            {
                AppointmentID = a.AppointmentID,
                PatientName = a.Patient!.FullName,
                PatientEmail = a.Patient!.Email,
                PatientImage = a.Patient!.ProfilePic,
                DoctorName = a.Doctor!.FullName,
                Specialty = a.Doctor!.Specialty,
                AppointmentDate = a.AppointmentDate,
                AppointmentTime = a.AppointmentTime,
                AppointmentType = a.AppointmentType,
                ReasonForVisit = a.ReasonForVisit,
                AppointmentStatus = a.AppointmentStatus,
                Notes = a.Notes,
                CancellationReason = a.CancellationReason,
                RescheduleReason = a.RescheduleReason,
                RescheduleDate = a.RescheduleDate,
                RescheduleTime = a.RescheduleTime,
                CreatedAt = a.CreatedAt,
                UpdatedAt = a.UpdatedAt
            });

            return Ok(result);
        }

        // GET: api/Appointment/1
        [HttpGet("{id}")]
        public async Task<IActionResult> Get(int id)
        {
            var a = await _context.Appointments
                .Include(x => x.Patient)
                .Include(x => x.Doctor)
                .FirstOrDefaultAsync(x => x.AppointmentID == id);

            if (a == null)
                return NotFound(new { message = "Appointment not found." });

            var dto = new AppointmentResponseDto
            {
                AppointmentID = a.AppointmentID,
                PatientName = a.Patient!.FullName,
                PatientEmail = a.Patient!.Email,
                PatientImage = a.Patient!.ProfilePic,
                DoctorName = a.Doctor!.FullName,
                Specialty = a.Doctor!.Specialty,
                AppointmentDate = a.AppointmentDate,
                AppointmentTime = a.AppointmentTime,
                AppointmentType = a.AppointmentType,
                ReasonForVisit = a.ReasonForVisit,
                AppointmentStatus = a.AppointmentStatus,
                Notes = a.Notes,
                CancellationReason = a.CancellationReason,
                RescheduleReason = a.RescheduleReason,
                RescheduleDate = a.RescheduleDate,
                RescheduleTime = a.RescheduleTime,
                CreatedAt = a.CreatedAt,
                UpdatedAt = a.UpdatedAt
            };

            return Ok(dto);
        }

        // POST: api/Appointment
        [HttpPost]
        public async Task<IActionResult> Create([FromBody] AppointmentDtos dto)
        {
            var a = new Appointment
            {
                PatientID = dto.PatientID,
                DoctorID = dto.DoctorID,
                Patient = await _context.Patients.FindAsync(dto.PatientID) ?? throw new ArgumentException("Invalid PatientID"),
                Doctor = await _context.Doctors.FindAsync(dto.DoctorID) ?? throw new ArgumentException("Invalid DoctorID"),
                AppointmentDate = dto.AppointmentDate,
                AppointmentTime = dto.AppointmentTime,
                AppointmentType = dto.AppointmentType,
                ReasonForVisit = dto.ReasonForVisit,
                AppointmentStatus = dto.AppointmentStatus,
                Notes = dto.Notes,
                CancellationReason = dto.CancellationReason,
                RescheduleReason = dto.RescheduleReason,
                RescheduleDate = dto.RescheduleDate,
                RescheduleTime = dto.RescheduleTime,
                CreatedAt = DateTime.UtcNow,
                UpdatedAt = DateTime.UtcNow
            };

            _context.Appointments.Add(a);
            await _context.SaveChangesAsync();

            dto.AppointmentID = a.AppointmentID;
            dto.CreatedAt = a.CreatedAt;
            dto.UpdatedAt = a.UpdatedAt;

            return CreatedAtAction(nameof(Get), new { id = a.AppointmentID }, dto);
        }

        // PUT: api/Appointment/1
        [HttpPut("{id}")]
        public async Task<IActionResult> Update(int id, [FromBody] AppointmentDtos dto)
        {
            var a = await _context.Appointments.FindAsync(id);
            if (a == null)
                return NotFound(new { message = "Appointment not found." });

            a.PatientID = dto.PatientID;
            a.DoctorID = dto.DoctorID;
            a.AppointmentDate = dto.AppointmentDate;
            a.AppointmentTime = dto.AppointmentTime;
            a.AppointmentType = dto.AppointmentType;
            a.ReasonForVisit = dto.ReasonForVisit;
            a.AppointmentStatus = dto.AppointmentStatus ?? a.AppointmentStatus;
            a.Notes = dto.Notes;
            a.CancellationReason = dto.CancellationReason;
            a.RescheduleReason = dto.RescheduleReason;
            a.RescheduleDate = dto.RescheduleDate;
            a.RescheduleTime = dto.RescheduleTime;
            a.UpdatedAt = DateTime.UtcNow;

            await _context.SaveChangesAsync();
            return Ok(new { message = "Appointment updated successfully." });
        }

        // DELETE: api/Appointment/1
        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            var a = await _context.Appointments.FindAsync(id);
            if (a == null)
                return NotFound(new { message = "Appointment not found." });

            _context.Appointments.Remove(a);
            await _context.SaveChangesAsync();

            return Ok(new { message = "Appointment deleted successfully." });
        }

        // PATCH: api/Appointment/status/1
        [HttpPatch("status/{id}")]
        public async Task<IActionResult> UpdateStatus(int id, [FromBody] string status)
        {
            var a = await _context.Appointments.FindAsync(id);
            if (a == null)
                return NotFound(new { message = "Appointment not found." });

            if (string.IsNullOrWhiteSpace(status))
                return BadRequest(new { message = "Status cannot be empty." });

            a.AppointmentStatus = status;
            a.UpdatedAt = DateTime.UtcNow;
            await _context.SaveChangesAsync();

            return Ok(new { message = "Status updated." });
        }

        // PATCH: api/Appointment/notes/1
        [HttpPatch("notes/{id}")]
        public async Task<IActionResult> UpdateNotes(int id, [FromBody] string notes)
        {
            var a = await _context.Appointments.FindAsync(id);
            if (a == null)
                return NotFound(new { message = "Appointment not found." });

            a.Notes = notes;
            a.UpdatedAt = DateTime.UtcNow;
            await _context.SaveChangesAsync();

            return Ok(new { message = "Notes updated." });
        }

        // PATCH: api/Appointment/cancel-reason/1
        [HttpPatch("cancel-reason/{id}")]
        public async Task<IActionResult> UpdateCancelReason(int id, [FromBody] string reason)
        {
            var a = await _context.Appointments.FindAsync(id);
            if (a == null)
                return NotFound(new { message = "Appointment not found." });

            a.CancellationReason = reason;
            a.UpdatedAt = DateTime.UtcNow;
            await _context.SaveChangesAsync();

            return Ok(new { message = "Cancellation reason updated." });
        }

        // PATCH: api/Appointment/reschedule/1
        [HttpPatch("reschedule/{id}")]
        public async Task<IActionResult> UpdateReschedule(int id, [FromBody] AppointmentDtos dto)
        {
            var a = await _context.Appointments.FindAsync(id);
            if (a == null)
                return NotFound(new { message = "Appointment not found." });

            a.RescheduleReason = dto.RescheduleReason;
            a.RescheduleDate = dto.RescheduleDate;
            a.RescheduleTime = dto.RescheduleTime;
            a.UpdatedAt = DateTime.UtcNow;

            await _context.SaveChangesAsync();
            return Ok(new { message = "Reschedule info updated." });
        }
    }
}
