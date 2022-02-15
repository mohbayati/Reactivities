using System;
using System.Collections.Generic;
using System.Text;

namespace Application.Profiles
{
    public class Profile
    {
        public string Username { get; set; }
        public string DisplayName { get; set; }
        public string Image { get; set; }
        public string Bio { get; set; }
        public ICollection<Domain.Photo> Photos { get; set; }
    }
}
