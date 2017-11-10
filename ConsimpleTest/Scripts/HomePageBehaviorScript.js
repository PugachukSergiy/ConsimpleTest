
var Purchase = {
    freeIndex: 0,
    ProductList: [],
    TotalCost: 0,
    AddProductToPuchase: function AddProductToPuchase(prod)
    {
        this.ProductList[this.freeIndex] = (prod);
        this.TotalCost += prod.Cost * prod.Number;
        RefreshTotalCost();
        this.freeIndex++;
    },
    DeleteProductFromPuchase: function DeleteProductFromPuchase(key)
    {
        this.TotalCost -= this.ProductList[key].Cost * this.ProductList[key].Number;
        RefreshTotalCost();
        delete ProductList[key];
    }
};

$('#NewProductForm').hide();
RefreshTotalCost();
loadArticles();





/////////////////////////////////////////////////////////////////////////////////////

function loadArticles()
{
    $.ajax({
        url: 'http://localhost:49551/api/Purchase',
        type: 'GET',
        success: function (articles) {
            articles.map(function (elem) { AddArticle(elem); });
        }
    });
}

function CreateArticle(article)
{
    var elem = "";
    elem += "<div class = 'Article'>";
    elem += "<button onclick=\"AddNewProduct(" + article.Id +", '" + article.Name +"')\">";
    elem += article.Name;
    elem += "</button>";
    elem += "</div>";
    return elem;
}

function AddArticle(article)
{
    elem = CreateArticle(article);
    $('#Articles').append(elem);
}

//////////////////////////////////////////////////////////////////////////////////////////

function RefreshTotalCost()
{
    $('#TotalCost').val(Purchase.TotalCost + ' грн.');
}


function CreateProduct(key, prod)
{
    var elem = "";
    elem += "<div id='"+key+"' class = 'Product'>";
    elem += prod.Name + " ";
    elem += "Стоимость: " + prod.Cost + " ";
    elem += "Кол-во: " + prod.Number + " ";
    elem += "<button onclick ='DeleteProduct("+key+")'>x</button>"
    elem += "</div>";
    return elem;
}

function AddNewProduct(id, name)
{
    $('#NewProductForm').show();
    $('.MakePurchase').hide();

    $('#NewProductId').val(id);
    $('#NewProductName').text(name);
    $('#NewProductNumber').val("");
    $('#NewProductCost').val("");
}

function CheckNewProductFields()
{
    if (!$('#NewProductId').val())
    {
        return false;
    }
    else if (!$('#NewProductName').text())
    {
        return false;
    }
    else if (!(/^[0123456789]+$/.test($('#NewProductNumber').val())))
    {
        this.alert("неверно указано количество");
        return false;
    }
    else if (!(/^[0123456789]+(\.[0123456789]{1,2})?$/.test($('#NewProductCost').val())))
    {
        this.alert("неверно указана цена");
        return false;
    } 
    return true;
}

function AddProduct()
{
    if (CheckNewProductFields()) {
        var prod = {
            Id: $('#NewProductId').val(),
            Name: $('#NewProductName').text(),
            Number: $('#NewProductNumber').val(),
            Cost: $('#NewProductCost').val()
        };

        var elem = CreateProduct(Purchase.freeIndex, prod);
        Purchase.AddProductToPuchase(prod);
        $('#ProductList').append(elem);
        $('#NewProductForm').hide();
        $('.MakePurchase').show();
    }

}


function CancleProduct()
{
    $('#NewProductForm').hide();
    $('.MakePurchase').show();
}

function DeleteProduct(key)
{
    Purchase.DeleteProductFromPuchase(key);
    $('#' + key + '.Product').remove();
}

function MakePurchase() {
    var arr = Purchase.ProductList;
    arr = JSON.stringify(Purchase.ProductList);
    $.ajax({
        url: 'http://localhost:49551/api/Purchase',
        type: 'POST',
        contentType: 'application/json;charset = utf-8',
        data: JSON.stringify(Purchase.ProductList),
        success: function (purchase) {
            var check = CreateCheck(purchase);
            $('#Result').append(check);
            Refresh();
        }
    });
}

///////////////////////////////////////////////////////////

function CreateCheck(purchase)
{
    var elem = "";
    elem += "Чек № " + purchase.Id;
    elem += "<table><tr><td>Товар</td><td>Цена</td><td>Кол-во</td><td>К оплате</td></tr>";
    purchase.ProductList.map(function (prod) {
        elem += "<tr><td>" + prod.Name + "</td><td>" + prod.Cost + "</td><td>" + prod.Number + "</td><td>" + (prod.Cost * prod.Number)+"</td></tr>"
    });
    elem += "<tr><b><td>Итого</td><td></td><td></td><td>" + purchase.TotalCost + "</td></b></tr></table>";
    elem += "Дата:" + purchase.Date;

    return elem;
}


function Refresh()
{
    Purchase.freeIndex = 0;
    Purchase.ProductList = [];
    Purchase.TotalCost = 0;
    RefreshTotalCost();
    $('#ProductList').empty();
}