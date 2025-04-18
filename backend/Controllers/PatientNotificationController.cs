using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using HealthCareAPI.DTOs; // Import your DTOs

namespace backend.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class PatientNotificationController : ControllerBase
    {
        private readonly HealthCareDbContext _context;

        public PatientNotificationController(HealthCareDbContext context)
        {
            _context = context;
        }

        // GET: api/PatientNotification
        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            var notifications = await _context.PatientNotifications
                .AsNoTracking()
                .Select(n => new PatientNotificationDtos
                {
                    Id = n.Id,
                    PatientID = n.PatientID,
                    NotificationType = n.NotificationType,
                    AppointmentReminders = n.AppointmentReminders,
                    AppointmentChanges = n.AppointmentChanges,
                    MedicalUpdates = n.MedicalUpdates,
                    IsEnabled = n.IsEnabled
                })
                .ToListAsync();

            return Ok(notifications);
        }

        // GET: api/PatientNotification/1
        [HttpGet("{id}")]
        public async Task<IActionResult> Get(int id)
        {
            var notification = await _context.PatientNotifications
                .AsNoTracking()
                .Where(n => n.Id == id)
                .Select(n => new PatientNotificationDtos
                {
                    Id = n.Id,
                    PatientID = n.PatientID,
                    NotificationType = n.NotificationType,
                    AppointmentReminders = n.AppointmentReminders,
                    AppointmentChanges = n.AppointmentChanges,
                    MedicalUpdates = n.MedicalUpdates,
                    IsEnabled = n.IsEnabled
                })
                .FirstOrDefaultAsync();

            if (notification == null)
                return NotFound(new { message = "Notification not found." });

            return Ok(notification);
        }

        // POST: api/PatientNotification
        [HttpPost]
        public async Task<IActionResult> Create([FromBody] PatientNotificationDtos dto)
        {
            var notification = new PatientNotification
            {
                PatientID = dto.PatientID,
                NotificationType = dto.NotificationType!,
                AppointmentReminders = dto.AppointmentReminders,
                AppointmentChanges = dto.AppointmentChanges,
                MedicalUpdates = dto.MedicalUpdates,
                IsEnabled = dto.IsEnabled,
                Patient = await _context.Patients.FindAsync(dto.PatientID) ?? throw new ArgumentNullException(nameof(dto.PatientID), "Patient not found.")
            };

            _context.PatientNotifications.Add(notification);
            await _context.SaveChangesAsync();

            dto.Id = notification.Id; // Set returned ID

            return CreatedAtAction(nameof(Get), new { id = notification.Id }, dto);
        }

        // PUT: api/PatientNotification/1
        [HttpPut("{id}")]
        public async Task<IActionResult> Update(int id, [FromBody] PatientNotificationDtos dto)
        {
            var notification = await _context.PatientNotifications.FindAsync(id);
            if (notification == null)
                return NotFound(new { message = "Notification not found." });

            notification.PatientID = dto.PatientID;
            notification.NotificationType = dto.NotificationType!;
            notification.AppointmentReminders = dto.AppointmentReminders;
            notification.AppointmentChanges = dto.AppointmentChanges;
            notification.MedicalUpdates = dto.MedicalUpdates;
            notification.IsEnabled = dto.IsEnabled;

            await _context.SaveChangesAsync();
            return Ok(new { message = "Notification updated successfully." });
        }

        // DELETE: api/PatientNotification/1
        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            var notification = await _context.PatientNotifications.FindAsync(id);
            if (notification == null)
                return NotFound(new { message = "Notification not found." });

            _context.PatientNotifications.Remove(notification);
            await _context.SaveChangesAsync();

            return Ok(new { message = "Notification deleted successfully." });
        }

        // PATCH: api/PatientNotification/status/1
        [HttpPatch("status/{id}")]
        public async Task<IActionResult> UpdateStatus(int id, [FromBody] bool isEnabled)
        {
            var notification = await _context.PatientNotifications.FindAsync(id);
            if (notification == null)
                return NotFound(new { message = "Notification not found." });

            notification.IsEnabled = isEnabled;
            await _context.SaveChangesAsync();

            return Ok(new { message = "IsEnabled updated successfully." });
        }

        // PATCH: api/PatientNotification/appointment-reminders/1
        [HttpPatch("appointment-reminders/{id}")]
        public async Task<IActionResult> UpdateAppointmentReminders(int id, [FromBody] bool value)
        {
            var notification = await _context.PatientNotifications.FindAsync(id);
            if (notification == null)
                return NotFound(new { message = "Notification not found." });

            notification.AppointmentReminders = value;
            await _context.SaveChangesAsync();

            return Ok(new { message = "AppointmentReminders updated successfully." });
        }

        // PATCH: api/PatientNotification/appointment-changes/1
        [HttpPatch("appointment-changes/{id}")]
        public async Task<IActionResult> UpdateAppointmentChanges(int id, [FromBody] bool value)
        {
            var notification = await _context.PatientNotifications.FindAsync(id);
            if (notification == null)
                return NotFound(new { message = "Notification not found." });

            notification.AppointmentChanges = value;
            await _context.SaveChangesAsync();

            return Ok(new { message = "AppointmentChanges updated successfully." });
        }

        // PATCH: api/PatientNotification/medical-updates/1
        [HttpPatch("medical-updates/{id}")]
        public async Task<IActionResult> UpdateMedicalUpdates(int id, [FromBody] bool value)
        {
            var notification = await _context.PatientNotifications.FindAsync(id);
            if (notification == null)
                return NotFound(new { message = "Notification not found." });

            notification.MedicalUpdates = value;
            await _context.SaveChangesAsync();

            return Ok(new { message = "MedicalUpdates updated successfully." });
        }
    }
}
