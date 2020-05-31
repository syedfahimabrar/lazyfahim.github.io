@using Microsoft.Ajax.Utilities
@using Model
@model IEnumerable<Model.Contest>

@{
    ViewBag.Title = "Index";
}
<div class="card mb-3">
    <div class="card-header">
        <i class="fa fa-table"></i> Contests
        @if (this.User.IsInRole("Admin"))
        {
            @Html.ActionLink("Create New", "Create")
        }
    </div>
    <div class="card-body">
        <div class="table-responsive table-striped table-bordered table-hover">
            <table id="Contests" class="table table-bordered" width="100%" cellspacing="0">
                <thead>
                <tr>
                    <th>
                        @Html.DisplayNameFor(model => model.Name)

                    </th>
                    @if (this.User.IsInRole("Admin"))
                    {
                        <th>
                            @Html.DisplayNameFor(model => model.Visible)
                        </th>
                    }

                    <th>
                        @Html.DisplayNameFor(model => model.StarTime)
                    </th>
                    <th>
                        @Html.DisplayNameFor(model => model.EndTime)
                    </th>
                    <th>Utilities</th>
                </tr>
                </thead>
                @*<tfoot>
                    <tr>
                        <th>Name</th>
                        <th>Position</th>
                        <th>Office</th>
                        <th>Age</th>
                        <th>Start date</th>
                        <th>Salary</th>
                    </tr>
                </tfoot>*@
                <tbody>

                @if (Model != null)
                {
                    foreach (var item in Model.OrderByDescending(t => t.StarTime.Millisecond))
                    {
                        <tr>
                            <td>
                                @Html.ActionLink(item.Name, "Details", new {id = item.Id})
                            </td>
                            @if (this.User.IsInRole("Admin"))
                            {
                                <td>
                                    @Html.DisplayFor(modelItem => item.Visible)
                                </td>
                            }

                            <td>
                                @Html.DisplayFor(modelItem => item.StarTime)
                            </td>
                            <td>
                                @Html.DisplayFor(modelItem => item.EndTime)
                            </td>
                            @if (this.User.IsInRole("Admin") || item.Judges.Where(c => c.Id == this.User.Identity.Name).Count()==1)
                            {
                                <td>
                                    @Html.ActionLink("Edit", "Edit", new {id = item.Id}) |
                                    @Html.ActionLink("Details", "Details", new {id = item.Id}) |
                                    <button data-problem-id="@item.Id" class="btn-link js-delete">Delete</button>
                                </td>
                            }
                            else
                            {
                                <td></td>
                            }

                        </tr>
                    }
                }
                </tbody>
            </table>
        </div>
    </div>
    <div class="card-footer small text-muted">Updated yesterday at 11:59 PM</div>
</div>
@section Scripts {
    @Scripts.Render("~/bundles/jqueryval")

    <script>
        $(document).ready(function () {
            $("#Contests").DataTable( {
                order: [[ 2, 'asc' ]]
            } );
            $("#Contests .js-delete").on("click",
                function () {
                    var button = $(this);
                    var obj = $(this);
                    var Url = "@Url.RouteUrl("DefaultApi",
                                   new { httproute = "", controller = "Contest"})/";
                    bootbox.confirm("Are you sure to delete this Contest?",
                        function(result) {
                            if (result) {
                                $.ajax({
                                    url: Url + obj.attr("data-problem-id"),
                                    method: "DELETE",
                                    success: function() {
                                        button.parents("tr").remove();
                                    }
                                });
                            }
                        });
                    
                });
        });
    </script>
}