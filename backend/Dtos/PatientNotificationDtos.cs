namespace HealthCareAPI.DTOs
{
    public class PatientNotificationDtos
    {
        public int Id { get; set; }
        public int PatientID { get; set; }
        public string? NotificationType { get; set; }
        public bool AppointmentReminders { get; set; }
        public bool AppointmentChanges { get; set; }
        public bool MedicalUpdates { get; set; }
        public bool IsEnabled { get; set; }
    }
}