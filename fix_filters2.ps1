$files = @(
  "d:\NJ fresh_Pos\frontend\src\pages\reports\CustomerReceiptsReport.tsx",
  "d:\NJ fresh_Pos\frontend\src\pages\reports\SupplierPaymentsReport.tsx",
  "d:\Pos-Nasa Fresh Mart\frontend\src\pages\reports\CustomerReceiptsReport.tsx",
  "d:\Pos-Nasa Fresh Mart\frontend\src\pages\reports\SupplierPaymentsReport.tsx"
)

foreach ($file in $files) {
    $content = Get-Content $file -Raw
    
    $content = $content -replace 'className="w-\[130px\] shrink-0"', 'className="w-full md:w-[130px] shrink-0"'
    $content = $content -replace 'className="w-\[100px\] shrink-0"', 'className="w-full md:w-[100px] shrink-0"'
    $content = $content -replace 'className="flex items-center gap-1.5 shrink-0 overflow-x-auto pb-1 sm:pb-0"', 'className="col-span-2 md:col-span-1 flex flex-wrap md:flex-nowrap items-center gap-1.5 shrink-0 pb-1 sm:pb-0"'
    
    Set-Content $file $content
}
