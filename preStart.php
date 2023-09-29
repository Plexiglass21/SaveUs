<!DOCTYPE html>
<html lang="it">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-T3c6CoIi6uLrA9TneNEoa7RxnatzjcDSCmG1MXxSR1GAsXEV/Dwwykc2MPK8M2HN" crossorigin="anonymous">
    <link rel="stylesheet" href="style.css">
    <title>Save US</title>
</head>
<?php   
    session_start();

    $UsernamePL = $_POST["Username"];    
    $PasswordPL = $_POST["Password"];

    if (empty($UsernamePL) || empty($PasswordPL)) {
        die("Username o password non forniti.");
    }

    $PasswordPL = md5($PasswordPL); //Converto la password in Hash tramite l'md5

    $conn = mysqli_connect("localhost", "saveus", "", "my_saveus") or die("Errore nella connessione al database");

    // Controllo se l'utente esiste
    $query = "SELECT * FROM Users WHERE username = '" . mysqli_real_escape_string($conn, $UsernamePL) . "' AND password = '" . mysqli_real_escape_string($conn, $PasswordPL) . "'";
    $result = mysqli_query($conn, $query);

    if (mysqli_num_rows($result) == 0) {
        // L'utente non esiste, quindi lo inserisco
        $insertQuery = "INSERT INTO Users (username, password) VALUES (?, ?)";
        $stmt = mysqli_prepare($conn, $insertQuery);
        mysqli_stmt_bind_param($stmt, 'ss', $UsernamePL, $PasswordPL);
        if (mysqli_stmt_execute($stmt)) {
            echo "\nUtente inserito con successo!";
        } else {
            echo "Errore nell'inserimento dell'utente: " . mysqli_error($conn);
            die();
        }
    } else {
        echo "L'utente esiste già nel database!";
    }
    
?>
<body>
    
    <script src="https://cdn.jsdelivr.net/npm/@popperjs/core@2.11.8/dist/umd/popper.min.js" integrity="sha384-I7E8VVD/ismYTF4hNIPjVp/Zjvgyol6VFvRkX/vR+Vc4jQkC+hVqc2pM8ODewa9r" crossorigin="anonymous"></script>
    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/js/bootstrap.min.js" integrity="sha384-BBtl+eGJRgqQAUMxJ7pMwbEyER4l1g+O15P+16Ep7Q9Q+zqX6gSbd85u4mG4QzX+" crossorigin="anonymous"></script>

    <div class="container-md  
        p-3 
        mt-5 
        d-flex 
        flex-column 
        justify-content-center 
        align-items-center">

        <h1 class="h1 m-5 font-weight-bold" style="font-size: 7rem;"> SAVE US</h1>
        <form action="" method="get">
                <div class="card border-4 rounded-5 px-6" 
                    style="
                        width: auto; 
                        height: auto;
                        box-shadow: 0 20px 200px rgba(0, 0, 0, 1);
                        background-color: rgba(255, 255, 255, 0.7);">
                
                <div class="card-body d-flex flex-column justify-content-center align-items-center" style="width: max-content;">
                    <h2 class="card-title mb-5 font-weight-bold mt-3" > Pick a character </h2>

                    <div class="row">
                        
                        <!-- Prima Card Guzzetta -->
                        <div class="col-sm-6 pr-3 bg-black" style="width: max-content;">
                            <div class="card container 
                                        d-flex flex-column 
                                        justify-content-center 
                                        align-items-center 
                                        border-black
                                        border-4 
                                        rounded-4" 
                                        
                                        style="width: max-content; background-color: rgba(255, 255, 255, 0.7);"> 
                                <img src="/src/img/G_icon_select.png" class="card-img-top mx-auto" alt="Guzzi" style="height: 200px; width: 200px;"> 
                                <div class="card-body">
                                    <h4 class="card-title">A. Guzzetta</h4>
                                    <h6 class="card-text">desciprion</h6>
                                    <a href="#" class="btn btn-primary">Chose</a>
                                </div>
                            </div>
                        </div>
                        

                        <!-- Seconda Card Valastro -->
                        <div class="col-sm-6 pl-3 bg-black" style="width: max-content;">
                            <div class="card container 
                                        d-flex flex-column 
                                        justify-content-center 
                                        align-items-center 
                                        border-black
                                        border-4 
                                        rounded-4"  
                                        
                                        style="width: max-content; background-color: rgba(255, 255, 255, 0.7);"> 
                                <img src="/src/img/V_icon_select.png" class="card-img-top mx-auto" alt="Guzzi" style="height: 200px; width: 200px;"> 
                                <div class="card-body">
                                    <h4 class="card-title">A. Valastro</h4>
                                    <h6 class="card-text">desciprion</h6>
                                    <a href="#" class="btn btn-primary">Chose</a>
                                </div>
                            </div>
                        </div>
                    </div>
        </form>
    
    </div>


    <?php
    ?>
</body>
</html>