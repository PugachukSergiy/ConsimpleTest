using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace ConsimpleTest.Models
{
    public class Article
    {
        public int Id { get; set; }
        public string Name { get; set; }
    }

    public class Product : Article
    {
        public float Cost { get; set; }
        public int Number { get; set; }
    }

    public class Purchase
    {
        public int Id { get; set; }
        public DateTime Date { get; set; }
        public float TotalCost { get; set; } 
        public List<Product> ProductList { get; set; } 
    }
}