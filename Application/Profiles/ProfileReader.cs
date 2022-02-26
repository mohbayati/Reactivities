using System.Linq;
using System.Net;
using System.Threading.Tasks;
using Application.Errors;
using Application.Interfaces;
using Microsoft.EntityFrameworkCore;
using Persistence;

namespace Application.Profiles
{
    public class ProfileReader : IProfileReader
    {
        private readonly DataContext _context;
        private readonly IUserAccess _userAccessor;
        public ProfileReader(DataContext context, IUserAccess userAccessor)
        {
            _userAccessor = userAccessor;
            _context = context;

        }
        public async Task<Profile> ReadProfile(string username)
        {
            var user = await _context.Users.SingleOrDefaultAsync(x =>
                x.UserName == username);

            if (user == null)
                throw new RestException(HttpStatusCode.BadRequest, new { User = "Not Found" });

            var currentUser = await _context.Users.SingleOrDefaultAsync(x =>
                x.UserName == _userAccessor.GetCurrentUsername());

            var profile = new Profile
            {
                Username = user.UserName,
                Bio = user.Bio,
                DisplayName = user.DisplayName,
                Image = user.Photos.FirstOrDefault(x => x.IsMain)?.Url,
                Photos = user.Photos,
                FollowersCount = user.Followers.Count(),
                FollowingCount = user.Followings.Count(),
            };

            if (currentUser.Followings.Any(x => x.TargetId == user.Id))
            {
                profile.IsFollowed = true;
            }
            return profile;
        }
    }
}