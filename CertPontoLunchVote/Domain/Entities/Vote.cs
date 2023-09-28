namespace CertPontoLunchVote.Domain.Entities
{
    public class Vote
    {
        public int Id { get; set; }
        public string UserId { get; set; } // ID do usuário que votou
        public int RestaurantId { get; set; } // ID do restaurante votado
        public DateTime VoteDate { get; set; }

        public Vote(string userId, int restaurantId)
        {
            UserId = userId;
            RestaurantId = restaurantId;
            VoteDate = DateTime.UtcNow; // Define a data do voto como a data atual
        }

    }
}
