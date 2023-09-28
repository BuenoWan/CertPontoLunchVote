namespace CertPontoLunchVote.Domain.Entities
{
    public class Restaurant
    {
        public int Id { get; set; }
        public required string Name { get; set; }
        public bool IsActive { get; set; }
        public ICollection<Vote> Votes { get; set; } // Relação com os votos associados a este restaurante
        public bool IsMostVoted { get; set; } // Demonstra se foi o mais votado da semana para não mostrar na lista

        public Restaurant()
        {
            Votes = new List<Vote>();
            IsActive = true;
            IsMostVoted = false;
        }
    }
}
