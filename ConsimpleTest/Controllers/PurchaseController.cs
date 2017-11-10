using ConsimpleTest.Models;
using System;
using System.Collections.Generic;
using System.Data.SqlClient;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Text;
using System.Text.RegularExpressions;
using System.Web.Http;

namespace ConsimpleTest.Controllers
{
    public class PurchaseController : ApiController
    {
        SqlConnection DBconnection = new SqlConnection("Data Source=(localdb)\\MSSQLLocalDB;Initial Catalog=ConsimpleTestDB;Integrated Security=True;Connect Timeout=30;Encrypt=False;TrustServerCertificate=True;ApplicationIntent=ReadWrite;MultiSubnetFailover=False");

        [HttpGet]
        public List<Article> GetArticles()
        {
            List<Article> ArtList = new List<Article>();
            using (DBconnection)
            {
                DBconnection.Open();
                SqlCommand command = new SqlCommand("SELECT * FROM Article", DBconnection);
                SqlDataReader DR = command.ExecuteReader();
                while (DR.Read())
                {
                    ArtList.Add(new Article() { Id = DR.GetInt32(0), Name = DR.GetString(1) });
                }
            }
            return ArtList;
        }


        [HttpPost]
        public Purchase GetArticles([FromBody]List<Product> Prlist)
        {
            Purchase purchase = new Purchase() { ProductList = Prlist };
            float total = 0;
            foreach(Product prod in Prlist)
            {
                total += prod.Number * prod.Cost;
            }
            purchase.TotalCost = total;

            using (DBconnection)
            {
                DBconnection.Open();
                SqlCommand command = new SqlCommand("INSERT INTO Purchase(Date) VALUES(GETDATE()) select @@IDENTITY as 'IDENTITY'", DBconnection);
                SqlDataReader DR = command.ExecuteReader();
                DR.Read();
                purchase.Id = (int)DR.GetSqlDecimal(0);
                DR.Close();

                Regex rgx = new Regex(",");

                StringBuilder Sbld = new StringBuilder("INSERT INTO Product(ArticleId, PurchaseId, Number, Cost) VALUES ("+ purchase.ProductList[0].Id + ", "+ purchase.Id+ ", "+ purchase.ProductList[0] .Number+ ", "+ rgx.Replace(purchase.ProductList[0].Cost.ToString(), ".") + ")");
                for (int i = 1; i < purchase.ProductList.Count; i++)
                {
                    Sbld.Append(", (" + purchase.ProductList[i].Id + ", " + purchase.Id + ", " + purchase.ProductList[i].Number + ", " + rgx.Replace(purchase.ProductList[i].Cost.ToString(), ".") + ")");
                }
                Sbld.Append(" SELECT Date FROM Purchase WHERE Id = "+ purchase.Id);
                command = new SqlCommand(Sbld.ToString(), DBconnection);
                DR = command.ExecuteReader();
                DR.Read();
                purchase.Date = DR.GetDateTime(0);
            }
            return purchase;
        }
    }
}
