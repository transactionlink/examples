function HostedWidget() {
    const redirectToWidget = async (): Promise<void> => {
        // Create workflow execution to obtain redirection link
        // Note that a call to Transactionlink API  needs to happen server-side
        // so that you don't expose your credentials in public
        try {
            const response = await fetch('http://localhost:8101/workflow-execution', {
                method: 'POST',
            });
            const data = await response.json();
            window.location = data.link;
        } catch (err) {
            console.error(err);
            throw err;
        }
    };

    return (
        <>
            {/* Button to trigger the widget */}
            <button onClick={redirectToWidget}>Redirect to Widget</button>
        </>
    );
}

export default HostedWidget;
