namespace backend.Dtos
{
    public class UpdateBioDto
    {
        public required string Bio { get; set; }
    }

    public class UpdateServiceDaysDto
    {
        public required string ServiceDays { get; set; }
    }

    public class UpdateStatusDto
    {
        public required string Status { get; set; }
    }

    public class UpdateSpecialtyDto
    {
        public required string Specialty { get; set; }
    }

    public class UpdateAvailabilityDto
    {
        public required string AvailabilityTimes { get; set; }
    }
}
